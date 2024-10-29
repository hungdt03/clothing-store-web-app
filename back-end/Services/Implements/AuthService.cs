using back_end.Core.Models;
using back_end.Core.Requests.Auth;
using back_end.Core.Responses;
using back_end.Exceptions;
using back_end.Infrastructures.JsonWebToken;
using back_end.Mappers;
using back_end.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using System.Net.Http.Headers;

namespace back_end.Services.Implements
{
    public class AuthService : IAuthService
    {
        private readonly SignInManager<User> signInManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly UserManager<User> userManager;
        private readonly ApplicationMapper applicationMapper;
        private readonly JwtService jwtService;

        public AuthService(SignInManager<User> signInManager, UserManager<User> userManager, ApplicationMapper mapper, JwtService jwtService, RoleManager<IdentityRole> roleManager)
        {
            this.signInManager = signInManager;
            this.userManager = userManager;
            applicationMapper = mapper;
            this.jwtService = jwtService;
            this.roleManager = roleManager;
        }

        public async Task<BaseResponse> GoogleAuthorize(string accessToken)
        {
            var userInfoEndpoint = $"https://www.googleapis.com/oauth2/v2/userinfo";

            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                HttpResponseMessage response = await client.GetAsync(userInfoEndpoint);

                if (response.IsSuccessStatusCode)
                {
                    string json = await response.Content.ReadAsStringAsync();
                    var userInfo = JsonConvert.DeserializeObject<OauthUserInfo>(json);

                    if(userInfo == null) throw new BadCredentialsException("Không thể lấy thông tin người từ google");

                    User? user = await userManager.FindByEmailAsync(userInfo.Email);

                    if (user == null)
                    {
                        user = await CreateUserFromGoogleResponse(userInfo);

                    } else
                    {
                        await CheckLinkToGoogleAccount(user, userInfo);
                    }

                    var userResource = await  applicationMapper.MapToUserResource(user);
                    var successResponse = new DataResponse<AuthResponse>();
                    successResponse.Success = true;
                    successResponse.Message = "Đăng nhập thành công";
                    successResponse.StatusCode = System.Net.HttpStatusCode.OK;
                    successResponse.Data = new AuthResponse()
                    {
                        User = userResource,
                        AccessToken = jwtService.GenerateTokenAccount(userResource),
                    };
                    
                    return successResponse;
                }
                else throw new BadCredentialsException("Không thể lấy thông tin người từ google");

                
            }
        }

        private async Task CheckLinkToGoogleAccount(User user, OauthUserInfo userInfo)
        {
            var logins = await userManager.GetLoginsAsync(user);
            var hasGoogleLogin = logins.Any(login => login.LoginProvider == "Google");
            if (!hasGoogleLogin)
            {
                var isInRoles = await userManager.IsInRoleAsync(user, "CUSTOMER");

                if (!isInRoles) {

                    var resultPushRole = await userManager.AddToRoleAsync(user, "CUSTOMER");
                    if (!resultPushRole.Succeeded) throw new Exception("Có lỗi khi cấp quyền cho user");
                }

                var addLoginResult = await userManager.AddLoginAsync(user, new UserLoginInfo("Google", userInfo.Id, "Google"));

                if (!addLoginResult.Succeeded)
                {
                    throw new Exception("Không thể thêm đăng nhập Google vào tài khoản.");
                }
            }

           
        }

        private async Task<User> CreateUserFromGoogleResponse(OauthUserInfo userInfo)
        {
            var user = new User
            {
                UserName = userInfo.Email,
                Email = userInfo.Email,
                FullName = userInfo.Name,
                EmailConfirmed = true,
                CreatedDate = DateTime.Now,
            };

            var createUserResult = await userManager.CreateAsync(user);
            if (!createUserResult.Succeeded)
            {
                throw new Exception("Không thể tạo người dùng mới");
            }

            var resultPushRole = await userManager.AddToRoleAsync(user, "CUSTOMER");

            if (!resultPushRole.Succeeded) throw new Exception("Có lỗi khi cấp quyền cho user");

            var addLoginResult = await userManager.AddLoginAsync(user, new UserLoginInfo("Google", userInfo.Id, "Google"));
            if (!addLoginResult.Succeeded)
            {
                throw new Exception("Không thể thêm thông tin đăng nhập cho người dùng");
            }

            return user;
        }

        public async Task<BaseResponse> SignIn(SignInRequest request)
        {
            var user = await userManager.FindByNameAsync(request.Username)
                ?? throw new BadCredentialsException("User không tồn tại");

            if (user.IsLocked) throw new BadCredentialsException("Tài khoản đã bị khóa");

            var result = await userManager.CheckPasswordAsync(user, request.Password);

            if (!result) throw new BadCredentialsException("Mật khẩu không chính xác");

            var userResource = await applicationMapper.MapToUserResource(user);

            var response = new DataResponse<AuthResponse>();
            response.Success = true;
            response.Message = "Đăng nhập thành công";
            response.StatusCode = System.Net.HttpStatusCode.OK;
            response.Data = new AuthResponse()
            {
                User = userResource,
                AccessToken = jwtService.GenerateTokenAccount(userResource),
            };

            return response;
            
        }

        public async Task<BaseResponse> SignUp(SignUpRequest request)
        {
            var findByUserName = await userManager.FindByNameAsync(request.Username);
            if (findByUserName != null) throw new BadCredentialsException("Username đã tồn tại");

            var findByEmail = await userManager.FindByEmailAsync(request.Email);
            if (findByEmail != null) throw new BadCredentialsException("Email đã tồn tại");

            User newUser = new User();
            newUser.UserName = request.Username;
            newUser.Email = request.Email;  
            newUser.FullName = request.FullName;
            newUser.PhoneNumber = request.PhongNumber;
            newUser.CreatedDate = DateTime.Now;

            var createResult = await userManager.CreateAsync(newUser, request.Password);

            if(createResult.Succeeded)
            {
                var resultPushRole = await userManager.AddToRoleAsync(newUser, "CUSTOMER");

                if (!resultPushRole.Succeeded) throw new Exception("Có lỗi khi cấp quyền cho user");

                var response = new BaseResponse();
                response.Success = true;
                response.Message = "Đăng kí tài khoản thành công";
                response.StatusCode = System.Net.HttpStatusCode.OK;
                
                return response;
            } else throw new BadCredentialsException(createResult.Errors.ToString());

        }
    }
}
