using System.ComponentModel.DataAnnotations;

namespace back_end.Core.Requests
{
    public class CategoryRequest
    {
        [Required(ErrorMessage = "Tên danh mục không được để trống")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Mô tả danh mục không được để trống")]
        public string Description { get; set; }
        public int? ParentCategoryId { get; set; }
    }
}
