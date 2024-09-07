namespace back_end.Core.Responses.Resources
{
    public class UserContactResource
    {
        public UserResource User { get; set; }
        public MessageResource Message { get; set; }
        public int TotalUnreadMessages { get; set; }
    }
}
