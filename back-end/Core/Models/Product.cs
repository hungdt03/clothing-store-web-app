using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using static System.Net.Mime.MediaTypeNames;

namespace back_end.Core.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public double OldPrice { get; set; }
        public double PurchasePrice { get; set; }
        public double Price { get; set; }
        public string Thumbnail { get; set; }
        public string ZoomImage { get; set; }
        public int? CategoryId { get; set; }
        public Category? Category { get; set; }

        public int? BrandId { get; set; }
        public Brand? Brand { get; set; }

        public ICollection<ProductImage>? Images { get; set; }
        public ICollection<ProductVariant> ProductVariants { get; set; }
        public ICollection<Evaluation> Evaluations { get; set; }


        public bool IsDeleted { get; set; } = false;
        public ICollection<Wishlist> Wishlist { get; set; }
    }
}
