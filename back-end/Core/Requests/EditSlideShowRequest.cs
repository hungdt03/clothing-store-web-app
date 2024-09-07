using System.ComponentModel.DataAnnotations;

namespace back_end.Core.Requests
{
    public class EditSlideShowRequest
    {
        [Required(ErrorMessage = "Tiêu đề không được để trống")]
        public string Title { get; set; }
        [Required(ErrorMessage = "Mô tả không được để trống")]
        public string Description { get; set; }
        [Required(ErrorMessage = "Tiêu đề nút không được để trống")]
        public string BtnTitle { get; set; }
        public IFormFile? BackgroundImage { get; set; }
    }
}
