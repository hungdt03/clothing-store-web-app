using back_end.Core.Models;
using back_end.Core.Requests;
using back_end.Core.Responses;

namespace back_end.Services.Interfaces
{
    public interface IAccountService
    {
        Task<BaseResponse> GetUserDetails();
        Task<BaseResponse> GetUserById(string id);
        Task<BaseResponse> CreateAccount(AccountRequest request);
        Task<BaseResponse> GetAllContactAccounts();
        Task<BaseResponse> GetAllAccounts(int pageIndex, int pageSize, string searchString);
        Task<BaseResponse> GetAllAdminAccounts();
        Task<BaseResponse> ChangePassword(ChangePasswordRequest request);
        Task<BaseResponse> RequestPasswordReset(string email);
        Task<BaseResponse> ResetPassword(ResetPasswordRequest request);
        Task<BaseResponse> ValidateToken(ValidateTokenRequest request);
        Task<BaseResponse> UpdateProfile(UpdateProfileRequest request);
        Task<BaseResponse> UploadAvatar(IFormFile file);
        Task<BaseResponse> UploadCoverImage(IFormFile file);
        Task UpdateAccount(string accountId, EditAccountRequest request);
        Task UpdateUserStatus(User user, bool status);
        Task LockAccount(string id);
        Task UnlockAccount(string id);
    }
}
