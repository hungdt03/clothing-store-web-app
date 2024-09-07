namespace back_end.Core.Responses.Resources
{
    public class UserResource
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Avatar {  get; set; }
        public string CoverImage {  get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Username { get; set; }
        public List<string> Roles { get; set; }
        public bool IsOnline { get; set; }
        public bool IsLocked {  get; set; }
        public DateTime RecentOnlineTime { get; set; }
    }
}
