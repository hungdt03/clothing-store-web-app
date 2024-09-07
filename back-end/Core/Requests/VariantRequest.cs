using System.ComponentModel.DataAnnotations;

namespace back_end.Core.Requests
{
    public class VariantRequest
    {
        [Required(ErrorMessage = "Tồn kho không được để trống")]
        public int InStock { get; set; }
        [Required(ErrorMessage = "Kích cỡ không được để trống")]
        public int SizeId { get; set; }
        [Required(ErrorMessage = "Màu sắc không được để trống")]
        public int ColorId { get; set; }
        [Required(ErrorMessage = "Sản phẩm không được để trống")]
        public int ProductId { get; set; }
        [Required(ErrorMessage = "Ảnh sản phẩm không được để trống")]
        public List<IFormFile> ThumbnailUrl { get; set; }
        public List<IFormFile>? Images { get; set; }
    }
}
