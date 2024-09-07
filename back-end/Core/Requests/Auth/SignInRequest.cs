using System.ComponentModel.DataAnnotations;

namespace back_end.Core.Requests.Auth
{
    public class SignInRequest
    {
        [Required(ErrorMessage = "Username không được để trống")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Mật khẩu không được để trống")]
        public string Password { get; set; }
    }
}
