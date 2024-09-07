using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace back_end.Core.Models
{
    public class Category
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public bool IsDeleted { get; set; } = false;

        public int? ParentCategoryId { get; set; }
        public Category? ParentCategory { set; get; }
        public ICollection<Category>? CategoryChildren { get; set; }
        public ICollection<Product>? Products { get; set; }
    }
}
