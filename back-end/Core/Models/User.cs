using Microsoft.AspNetCore.Identity;

namespace back_end.Core.Models
{
    public class User : IdentityUser
    {
        public string FullName { get; set; }
        public string? Avatar { get; set; }
        public string? CoverImage { get; set; }
        public ICollection<Order> Orders { get; set; }
        public List<AddressOrder> AddressOrders { get; set; }
        public List<Evaluation> Evaluations { get; set; }
        public List<Evaluation> EvaluationFavorites { get; set; }
        public ICollection<Message> MessagesSent { get; set; }
        public ICollection<Message> MessagesReceived { get; set; }
        public bool IsOnline { get; set; }
        public DateTime RecentOnlineTime { get; set; }
        public List<DeviceToken> DeviceTokens { get; set; }
        public List<Blog> Blogs { get; set; }
        public List<Notification> Notifications { get; set; }
        public Wishlist Wishlist { get; set; }
        public bool IsLocked { get; set; } = false;
    }
}
