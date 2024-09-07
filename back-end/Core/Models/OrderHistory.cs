using System.ComponentModel.DataAnnotations;

namespace back_end.Core.Models
{
    public class OrderHistory
    {
        [Key]
        public int Id { get; set; }
        public DateTime? ModifyAt { get; set; }
        public string OrderStatus { get; set; }
        public string? Note { get; set; }
        public int OrderId { get; set; }
        public Order Order { get; set; }
    }
}
