using System.ComponentModel.DataAnnotations;

namespace back_end.Core.Models
{
    public class Wishlist
    {
        [Key]
        public int Id { get; set; }
        public ICollection<Product> Products { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
    }
}
