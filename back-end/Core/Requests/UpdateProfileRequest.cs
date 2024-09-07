using System.ComponentModel.DataAnnotations;

namespace back_end.Core.Requests
{
    public class UpdateProfileRequest
    {

        [Required(ErrorMessage = "Họ và tên không được để trống")]
        public string FullName { get; set; }
        [Required(ErrorMessage = "Username không được để trống")]
        public string Username { get; set; }
        [Required(ErrorMessage = "Số điện thoại không được để trống")]
        public string PhoneNumber { get; set; }
        [Required(ErrorMessage = "Địa chỉ email không được để trống")]
        [EmailAddress(ErrorMessage = "Địa chỉ email không đúng định dạng")]
        public string Email { get; set; }
    }
}
