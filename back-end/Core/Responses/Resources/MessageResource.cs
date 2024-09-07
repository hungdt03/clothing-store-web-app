namespace back_end.Core.Responses.Resources
{
    public class MessageResource
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public UserResource Sender { get; set; }
        public UserResource Recipient { get; set; }
        public DateTime SentAt { get; set; }
        public List<string> Images { get; set; }
    }

}
