using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace back_end.Core.Models
{
    public class Color
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string HexCode { get; set; }
        public bool IsDeleted { get; set; } = false;
        public ICollection<ProductVariant>? ProductVariants { get; set; }
    }
}
