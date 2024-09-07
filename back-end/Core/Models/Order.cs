using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace back_end.Core.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        public DateTime CreatedAt { get; set; }

        public double TotalPrice { get; set; }

        public int Quantity { get; set; }
        public string OrderNote { get; set; }

        public string OrderStatus { get; set; }
        public bool IsDeleted { get; set; } = false;

        public string UserId { get; set; }
        public User User { get; set; }

        public int PaymentId { get; set; }
        public Payment Payment { get; set; }
        public List<OrderHistory> OrderHistories { get; set; } = new List<OrderHistory>();
        public int AddressOrderId { get; set; }
        public AddressOrder AddressOrder { get; set; }

        public ICollection<OrderItem> OrderItems { get; set; }
    }
}
