using System.ComponentModel.DataAnnotations;

namespace back_end.Core.Models
{
    public class ProductVariant
    {
        [Key]
        public int Id { get; set; }
        public int InStock { get; set; }
        public int SizeId { get; set; }
        public int ColorId { get; set; }
        public int ProductId { get; set; }
        public string ThumbnailUrl { get; set; }
        public Size? Size { get; set; }
        public Color? Color { get; set; }
        public Product? Product { get; set; }
        public ICollection<OrderItem>? OrderItems { get; set; }
        public ICollection<ProductVariantImage>? Images { get; set; }
        public bool IsDeleted { get; set; } = false;
    }
}
