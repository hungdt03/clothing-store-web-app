using System.ComponentModel.DataAnnotations;

namespace back_end.Core.Models
{
    public class Evaluation
    {
        [Key]
        public int Id { get; set; }
        public string Content { get; set; }
        public int Stars { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public ICollection<User> Favorites { get; set; } = new List<User>();
        public DateTime DateCreated { get; set; }
    }
}
