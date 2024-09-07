using back_end.Core.Requests.Auth;
using back_end.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;


namespace back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService authService;

        public AuthController(IAuthService authService)
        {
            this.authService = authService;
        }

        [HttpPost("signin")]
        public async Task<IActionResult> SignIn([FromBody] SignInRequest request)
        {
            var response = await authService.SignIn(request);
            return Ok(response);
        }

        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] SignUpRequest request)
        {
            var response = await authService.SignUp(request);
            return Ok(response);
        }

        [HttpPost("google/authorize")]
        public async Task<IActionResult> GoogleAuthorize([FromBody] GoogleAuthorizeRequest request)
        {
            var response = await authService.GoogleAuthorize(request.AccessToken);
            return Ok(response);
        }
    }
}
