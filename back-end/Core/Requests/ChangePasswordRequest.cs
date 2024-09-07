using System.ComponentModel.DataAnnotations;

namespace back_end.Core.Requests
{
    public class ChangePasswordRequest
    {
        [Required(ErrorMessage = "Mật khẩu cũ không được để trống")]
        public string OldPassword { get; set; }
        [Required(ErrorMessage = "Mật khẩu mới không được để trống")]
        [Compare(nameof(OldPassword), ErrorMessage = "Mật khẩu mới không được giống với mật khẩu cũ")]
        public string NewPassword { get; set; }
    }
}
