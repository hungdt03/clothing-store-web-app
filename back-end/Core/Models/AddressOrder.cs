using System.ComponentModel.DataAnnotations;

namespace back_end.Core.Models
{
    public class AddressOrder
    {
        [Key]
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public bool IsDefault { get; set; }
        public User User { get; set; }
        public string UserId { get; set; }
        public List<Order> Orders { get; set; }
    }
}
