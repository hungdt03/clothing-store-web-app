namespace back_end.Core.DTOs
{
    public class MessageDTO
    {
        public string SenderId { get; set; }
        public string Content { get; set; }
        public string RecipientId { get; set; }
        public List<IFormFile> Images { get; set; }
        public string GroupName { get; set; }
        public bool HaveRead { get; set; }
        public DateTime ReadAt { get; set; }
    }
}
