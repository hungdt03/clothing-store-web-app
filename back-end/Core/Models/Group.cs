using System.ComponentModel.DataAnnotations;

namespace back_end.Core.Models
{
    public class Group
    {
        [Key]
        public string GroupName { get; set; }
        public Message Message { get; set; }
        public int MessageId { get; set; }
        public int TotalUnReadMessages { get; set; }
    }
}
