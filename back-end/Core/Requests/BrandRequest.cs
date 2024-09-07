using System.ComponentModel.DataAnnotations;

namespace back_end.Core.Requests
{
    public class BrandRequest
    {
        [Required(ErrorMessage = "Tên thương hiệu không được để trống")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Mô tả thương hiệu không được để trống")]
        public string Description { get; set; }
    }
}
