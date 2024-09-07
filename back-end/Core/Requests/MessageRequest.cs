namespace back_end.Core.Requests
{
    public class MessageRequest
    {
        public string RecipientId { get; set; }
        public string Content { get; set; }
        public List<IFormFile> Images { get; set; }
    }
}
