using System.ComponentModel.DataAnnotations;

namespace back_end.Core.Models
{
    public class MessageImage
    {
        [Key]
        public int Id { get; set; }
        public string Url { get; set; }
        public int MessageId { get; set; }
        public Message Message { get; set; }
    }
}
