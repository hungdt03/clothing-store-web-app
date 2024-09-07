using back_end.Core.Requests.Auth;
using back_end.Core.Responses;

namespace back_end.Services.Interfaces
{
    public interface IAuthService
    {
        Task<BaseResponse> SignIn(SignInRequest request);
        Task<BaseResponse> SignUp(SignUpRequest request);
        Task<BaseResponse> GoogleAuthorize(string accessToken);
    }
}
