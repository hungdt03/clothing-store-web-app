using System.ComponentModel.DataAnnotations;

namespace back_end.Core.Models
{
    public class Blog
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public string Thumbnail { get; set; }
        public string TextPlain { get; set; }
        public string Content { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsHidden { get; set; } = false;
        public User User { get; set; }
        public string UserId { get; set; }

    }
}
