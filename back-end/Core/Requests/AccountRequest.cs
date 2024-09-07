using System.ComponentModel.DataAnnotations;

namespace back_end.Core.Requests
{
    public class AccountRequest
    {
        [Required(ErrorMessage = "Họ và tên không được để trống")]
        public string FullName { get; set; }
        [Required(ErrorMessage = "Username không được để trống")]
        public string Username { get; set; }
        [Required(ErrorMessage = "Mật khẩu không được để trống")]
        public string Password { get; set; }
        [Required(ErrorMessage = "Địa chỉ email không được để trống")]
        [EmailAddress(ErrorMessage = "Địa chỉ email không đúng định dạng")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Quyền không được để trống")]
        public List<string> RoleNames { get; set; }

    }
}
