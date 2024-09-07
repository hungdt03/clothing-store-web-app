using System.ComponentModel.DataAnnotations;

namespace back_end.Core.Requests
{
    public class CreateProductRequest
    {
        [Required(ErrorMessage = "Tên sản phẩm không được để trống")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Mô tả sản phẩm không được để trống")]
        public string Description { get; set; }
        [Required(ErrorMessage = "Giá cũ sản phẩm không được để trống")]
        public double OldPrice { get; set; }
        [Required(ErrorMessage = "Giá sản phẩm không được để trống")]
        public double Price { get; set; }
        [Required(ErrorMessage = "Ảnh sản phẩm không được để trống")]
        public List<IFormFile> Thumbnail { get; set; }
        [Required(ErrorMessage = "Ảnh phóng to của sản phẩm không được để trống")]
        public List<IFormFile> ZoomImage { get; set; }
        public List<IFormFile>? OtherImages { get; set; }
        [Required(ErrorMessage = "Danh mục của sản phẩm không được để trống")]
        public int CategoryId { get; set; }
        [Required(ErrorMessage = "Thương hiệu của sản phẩm không được để trống")]
        public int BrandId { get; set; }
    }
}
