using System.ComponentModel.DataAnnotations;

namespace back_end.Core.Models
{
    public class Brand
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public bool IsDeleted { get; set; } = false;

        public ICollection<Product>? Products { get; set; }
    }
}
