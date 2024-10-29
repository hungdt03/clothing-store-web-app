using back_end.Core.Models;
using back_end.Core.Requests;
using back_end.Core.Responses;
using back_end.Core.Responses.Resources;
using back_end.Data;
using back_end.Exceptions;
using back_end.Extensions;
using back_end.Infrastructures.Cloudinary;
using back_end.Infrastructures.MailSender;
using back_end.Mappers;
using back_end.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;

namespace back_end.Services.Implements
{
    public class AccountService : IAccountService
    {
        private readonly ApplicationMapper _mapper;
        private readonly MyStoreDbContext _dbContext;
        private readonly UserManager<User> userManager;
        private readonly RoleManager<IdentityRole> roleManager; 
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IConfiguration _configuration;
        private readonly MailService mailService;
        private readonly IUploadService uploadService;

        public AccountService(ApplicationMapper mapper, MyStoreDbContext dbContext, UserManager<User> userManager, IHttpContextAccessor contextAccessor, IConfiguration configuration, MailService mailService, IUploadService uploadService, RoleManager<IdentityRole> roleManager)
        {
            this.userManager = userManager;
            _mapper = mapper;
            _dbContext = dbContext;
            _contextAccessor = contextAccessor;
            _configuration = configuration;
            this.mailService = mailService;
            this.uploadService = uploadService;
            this.roleManager = roleManager;
        }

        public async Task<BaseResponse> ChangePassword(ChangePasswordRequest request)
        {
            var userId = _contextAccessor.HttpContext.User.FindFirst(ClaimTypes.Sid).Value
               ?? throw new BadCredentialsException("Vui lòng đăng nhập lại");

            User user = await userManager.FindByIdAsync(userId);
            var isMatchOldPassword = userManager.PasswordHasher.VerifyHashedPassword(user, user.PasswordHash, request.OldPassword);
            if (isMatchOldPassword != PasswordVerificationResult.Success)
                throw new Exception("Mật khẩu cũ không chính xác");

            PasswordHasher<User> hashedPassword = new PasswordHasher<User>();
            user.PasswordHash = hashedPassword.HashPassword(user, request.NewPassword);
            await userManager.UpdateAsync(user);

            var response = new BaseResponse();
            response.Success = true;
            response.StatusCode = System.Net.HttpStatusCode.OK;
            response.Message = "Cập nhật mật khẩu mới thành công";
            return response;
        }

        public async Task<BaseResponse> GetAllContactAccounts()
        {
            var userName = _contextAccessor.HttpContext.User.GetUsername();
            List<User> users = await _dbContext.Users
                .Where(u => u.UserName != userName)
                .ToListAsync();

            var userResources = new List<UserContactResource>();
            foreach (var user in users)
            {
                var roles = await userManager.GetRolesAsync(user);
                var groupName = GetGroupName(userName, user.UserName);
                var group = await _dbContext.Groups
                    .Include(g => g.Message)
                    .SingleOrDefaultAsync(g => g.GroupName.Equals(groupName));

                var resource = await _mapper.MapToUserContactResource(user);
                if (group != null)
                {
                    resource.Message = _mapper.MapToMessageResource(group.Message);
                    resource.TotalUnreadMessages = 0;
                } else
                {
                    resource.Message = new MessageResource
                    {
                        Content = "Chưa kết nối",
                        SentAt = DateTime.Now,
                    };
                    resource.TotalUnreadMessages = 0;
                }

                userResources.Add(resource);
            }

            var response = new DataResponse<List<UserContactResource>>();
            response.Success = true;
            response.StatusCode = System.Net.HttpStatusCode.OK;
            response.Message = "Lấy danh sách tài khoản thành công";
            response.Data = userResources;
            return response;
        }

        public async Task<BaseResponse> GetAllAdminAccounts()
        {
            var userName = _contextAccessor.HttpContext.User.GetUsername();
            List<User> users = await _dbContext.Users
                .Where(u => u.UserName != userName)
                .ToListAsync();

            var userResources = new List<UserContactResource>();
            foreach (var user in users)
            {
                var roles = await userManager.GetRolesAsync(user);
                var groupName = GetGroupName(userName, user.UserName);
                var group = await _dbContext.Groups
                   .Include(g => g.Message)
                   .SingleOrDefaultAsync(g => g.GroupName.Equals(groupName));

                if (roles.Contains("ADMIN"))
                {
                    var resource = await _mapper.MapToUserContactResource(user);
                    if (group != null)
                    {
                        resource.Message = _mapper.MapToMessageResource(group.Message);
                        resource.TotalUnreadMessages = 0;
                    }
                    else
                    {
                        resource.Message = new MessageResource
                        {
                            Content = "Chưa kết nối",
                            SentAt = DateTime.Now,
                        };
                        resource.TotalUnreadMessages = 0;
                    }

                    userResources.Add(resource);
                } 
            }

      

            var response = new DataResponse<List<UserContactResource>>();
            response.Success = true;
            response.StatusCode = System.Net.HttpStatusCode.OK;
            response.Message = "Lấy danh sách tài khoản thành công";
            response.Data = userResources;
            return response;
        }

        public async Task<BaseResponse> GetUserDetails()
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId()
                ?? throw new BadCredentialsException("Vui lòng đăng nhập lại");
            var user = await userManager.FindByIdAsync(userId);

            var response = new DataResponse<UserResource>();
            response.Success = true;
            response.Message = "Lấy thông tin user thành công";
            response.StatusCode = System.Net.HttpStatusCode.OK;
            response.Data = await _mapper.MapToUserResource(user);

            return response;

        }

        public async Task<BaseResponse> RequestPasswordReset(string email)
        {
            if (string.IsNullOrEmpty(email))
                throw new Exception("Vui lòng cung cấp địa chỉ email");

            var user = await userManager.FindByEmailAsync(email);
            if (user == null)
                throw new Exception("User không tồn tại");

            var code = await userManager.GeneratePasswordResetTokenAsync(user);

            byte[] bytesToEncode = Encoding.UTF8.GetBytes(code);
            string base64EncodedString = Convert.ToBase64String(bytesToEncode);
            var url = $"{_configuration["ClientURL"]}/reset-password?email={email}&activationToken={base64EncodedString}";
            var content = $"Here is link reset your password: {url}";
            var subject = "Reset password";
            mailService.SendMail(user.Email, content, subject);

            var response = new BaseResponse();
            response.Success = true;
            response.Message = "Vui lòng kiểm tra email của bạn";
            response.StatusCode = System.Net.HttpStatusCode.OK;

            return response;
        }

        public async Task<BaseResponse> ResetPassword(ResetPasswordRequest request)
        {
            var user = await userManager.FindByEmailAsync(request.Email);

            if (user != null)
            {
                byte[] decodedBytes = Convert.FromBase64String(request.ActivationToken);
                string activationTokenDecode = Encoding.UTF8.GetString(decodedBytes);

                var result = await userManager.ResetPasswordAsync(user, activationTokenDecode, request.Password);

                if (result.Succeeded)
                {
                    var response = new BaseResponse();
                    response.Success = true;
                    response.Message = "Thay đổi mật khẩu thành công";
                    response.StatusCode = System.Net.HttpStatusCode.OK;

                    return response;
                } else throw new Exception(result.Errors.ToString());
            } else throw new Exception("Có lỗi xảy ra khi xác thực thông tin");
            
        }

        public async Task<BaseResponse> UpdateProfile(UpdateProfileRequest request)
        {

            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var user = await userManager.FindByIdAsync (userId);

            var userLogins = await userManager.GetLoginsAsync(user);
            if (userLogins.Count > 0)
            {
                throw new Exception("Email này đang được liên kết với tài khoản MXH");
            }

            if (user == null) throw new BadCredentialsException("Vui lòng đăng nhập lại");

            if (user.UserName != request.Username)
            {
                var userByUsername = await userManager.FindByNameAsync(request.Username);
                if (userByUsername != null) throw new Exception("Username này đã tồn tại");
            }

            if (user.Email != request.Email)
            {
                var userByEmail = await userManager.FindByEmailAsync(request.Email);
                if (userByEmail != null) throw new Exception("Địa chỉ email này đã tồn tại");
            }
           

            user.Email = request.Email;
            user.UserName = request.Username;
            user.FullName = request.FullName;
            user.PhoneNumber = request.PhoneNumber;

            var result = await userManager.UpdateAsync(user);
            if (!result.Succeeded)
                throw new Exception(result.Errors.FirstOrDefault()?.Description ?? "Cập nhật thông tin user thất bại");

            var response = new DataResponse<UserResource>();
            response.Success = true;
            response.Message = "Cập nhật profile thành công";
            response.StatusCode = System.Net.HttpStatusCode.OK;
            response.Data = await _mapper.MapToUserResource(user);

            return response;
        }

        public async Task UpdateUserStatus(User user, bool status)
        {
            user.IsOnline = status;
            user.RecentOnlineTime = DateTime.Now;
            await _dbContext.SaveChangesAsync();
        }

        public async Task<BaseResponse> UploadAvatar(IFormFile file)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var user = await userManager.FindByIdAsync(userId);

            if (user == null) throw new BadCredentialsException("Vui lòng đăng nhập lại");

            var avatar = await uploadService.UploadSingleFileAsync(file);
            user.Avatar = avatar;
            var result = await userManager.UpdateAsync(user);

            if (!result.Succeeded)
                throw new Exception(result.Errors.FirstOrDefault().Description ?? "Upload ảnh đại diện thất bại");

            var response = new DataResponse<UserResource>();
            response.Success = true;
            response.Message = "Cập nhật profile thành công";
            response.StatusCode = System.Net.HttpStatusCode.OK;
            response.Data = await _mapper.MapToUserResource(user);

            return response;
        }

        public async Task<BaseResponse> UploadCoverImage(IFormFile file)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var user = await userManager.FindByIdAsync(userId);

            if (user == null) throw new BadCredentialsException("Vui lòng đăng nhập lại");

            var coverImage = await uploadService.UploadSingleFileAsync(file);
            user.CoverImage = coverImage;
            var result = await userManager.UpdateAsync(user);

            if (!result.Succeeded)
                throw new Exception(result.Errors.FirstOrDefault().Description ?? "Upload ảnh bìa thất bại");

            var response = new DataResponse<UserResource>();
            response.Success = true;
            response.Message = "Cập nhật profile thành công";
            response.StatusCode = System.Net.HttpStatusCode.OK;
            response.Data = await _mapper.MapToUserResource(user);

            return response;
        }

        public async Task<BaseResponse> ValidateToken(ValidateTokenRequest request)
        {
            var user = await userManager.FindByEmailAsync(request.Email);

            byte[] decodedBytes = Convert.FromBase64String(request.ActivationToken);
            string activationTokenDecode = Encoding.UTF8.GetString(decodedBytes);
            var isValidToken = await userManager.VerifyUserTokenAsync(user, userManager.Options.Tokens.PasswordResetTokenProvider, "ResetPassword", activationTokenDecode);

            var response = new BaseResponse();
            response.Success = true;
            response.Message = "Token còn hiệu lực";
            response.StatusCode = System.Net.HttpStatusCode.OK;

            if (isValidToken)
                return response;

            response.Success = false;
            response.Message = "Link này đã hết hiệu lực";
            return response;
        }

        private string GetGroupName(string caller, string other)
        {
            var stringCompare = string.CompareOrdinal(caller, other) < 0;
            return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
        }

        public async Task<BaseResponse> GetAllAccounts(int pageIndex, int pageSize, string searchString)
        {
            var lowerString = searchString.ToLower();
            var queryable = _dbContext.Users.Where(u => u.FullName.ToLower().Contains(lowerString));
            List<User> users = queryable
                .Skip((pageIndex - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var userResources = new List<UserResource>();
            foreach (var user in users)
            {
                var userResource = await _mapper.MapToUserResource(user);
                userResources.Add(userResource);
            }

            var totalItems = queryable.Count();
            var response = new PaginationResponse<List<UserResource>>
            {
                Success = true,
                StatusCode = System.Net.HttpStatusCode.OK,
                Message = "Lấy danh sách tài khoản thành công",
                Data = userResources,
                Pagination = new Pagination
                {
                    TotalItems = totalItems,
                    TotalPages = (int) Math.Ceiling((double)totalItems/pageSize)
                }
            };

            return response;
        }

        public async Task LockAccount(string id)
        {
            var currentUserId = _contextAccessor.HttpContext.User.GetUserId();

            if (currentUserId == id) throw new Exception("Không thể khóa khi đang sử dụng tài khoản này");

            var user = await userManager.FindByIdAsync(id);
            if (user == null)
                throw new NotFoundException("User không tồn tại");
            user.IsLocked = true;
            var result = await userManager.UpdateAsync(user);

            if (!result.Succeeded) throw new Exception("Khóa tài khoản người dùng thất bại");
        }

        public async Task UnlockAccount(string id)
        {
            var currentUserId = _contextAccessor.HttpContext.User.GetUserId();

            if (currentUserId == id) throw new Exception("Không thể bỏ khóa khi đang sử dụng tài khoản này");

            var user = await userManager.FindByIdAsync(id);
            if (user == null)
                throw new NotFoundException("User không tồn tại");
            user.IsLocked = false;
            var result = await userManager.UpdateAsync(user);

            if (!result.Succeeded) throw new Exception("Bỏ khóa tài khoản người dùng thất bại");
        }

        public async Task<BaseResponse> CreateAccount(AccountRequest request)
        {
            User findByEmail = await userManager.FindByEmailAsync(request.Email);
            if (findByEmail != null) throw new Exception("Địa chỉ email đã tồn tại");

            User findByUsername = await userManager.FindByNameAsync(request.Username);
            if (findByUsername != null) throw new Exception("Username đã tồn tại");

            User newAccount = new User();
            newAccount.Email = request.Email;
            newAccount.FullName = request.FullName;
            newAccount.UserName = request.Username;

            var createResult = await userManager.CreateAsync(newAccount, request.Password);
            if (!createResult.Succeeded) throw new Exception("Thất bại khi thêm tài khoản mới");

            var result = await userManager.AddToRolesAsync(newAccount, request.RoleNames);
            if (!result.Succeeded) throw new Exception($"Thất bại khi thêm roles");

            var response = new BaseResponse()
            {
                Success = true,
                Message = "Thêm tài khoản mới thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };

            return response;
        }

        public async Task UpdateAccount(string accountId, EditAccountRequest request)
        {

            var user = await userManager.FindByIdAsync(accountId);
            if (user == null)
                throw new NotFoundException("Tài khoản không tồn tại");

            //var isAssociatedToOauthAccount = await userManager.GetLoginsAsync(user);
            //if (isAssociatedToOauthAccount.Count > 0) throw new Exception($"Email tài khoản được liên kết với {string.Join(", ", isAssociatedToOauthAccount.Select(item => item.ProviderDisplayName))}");

            //if(request.Username != user.UserName)
            //{
            //    var checkByUsername = await userManager.FindByNameAsync(request.Username);
            //    if (checkByUsername != null) throw new Exception("Username đã tồn tại");
            //}

            //if (request.Email != user.Email)
            //{
            //    var checkByEmail = await userManager.FindByEmailAsync(request.Email);
            //    if (checkByEmail != null) throw new Exception("Địa chỉ email đã tồn tại");
            //}

            //var checkPassword = await userManager.CheckPasswordAsync(user, request.OldPassword);
            //if (!checkPassword) throw new Exception("Mật khẩu không chính xác");

            //user.Email = request.Email;
            //user.FullName = request.FullName;
            //user.UserName = request.Username;

            //var changePasswordResult = await userManager.ChangePasswordAsync(user, request.OldPassword, request.NewPassword);
            //if (!changePasswordResult.Succeeded)
            //    throw new Exception("Không thể thay đổi mật khẩu");

            var userRoles = await userManager.GetRolesAsync(user);

            var resultRemoveRoles = await userManager.RemoveFromRolesAsync(user, userRoles);
            if (!resultRemoveRoles.Succeeded) throw new Exception("Có lỗi xảy ra khi cập nhật role cho người dùng");

            var resultAddRoles = await userManager.AddToRolesAsync(user, request.RoleNames);
            if (!resultAddRoles.Succeeded) throw new Exception($"Thất bại khi thêm roles");

            var saveResult = await userManager.UpdateAsync(user);
            if (!saveResult.Succeeded) throw new Exception("Cập nhật thông tin role tài khoản thất bại");
        }

        public async Task<BaseResponse> GetUserById(string id)
        {
            var user = await userManager.FindByIdAsync(id);
            if (user == null) throw new NotFoundException("Tài khoản không tồn tại");

            var response = new DataResponse<UserResource>
            {
                Data = await _mapper.MapToUserResource(user),
                Message = "Lấy thông tin tài khoản thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };

            return response;
        }
    }
}
