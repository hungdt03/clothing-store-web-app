namespace back_end.Core.DTOs
{
    public class NotificationDTO
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string RecipientId { get; set; }
        public int ReferenceId { get; set; }
        public DateTime CreatedAt { get; set; }
        public string NotificationType { get; set; }
    }
}
