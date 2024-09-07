using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace back_end.Core.Models
{
    public class Size
    {
        [Key]
        public int Id { get; set; }
        public string ESize { get; set; }
        public double MinHeight { get; set; }
        public double MaxHeight { get; set; }

        public double MinWeight { get; set; }

        public double MaxWeight { get; set; }

        public bool IsDeleted { get; set; } = false;

        public ICollection<ProductVariant>? ProductVariants { get; set; }
    }
}
