namespace back_end.Core.Responses.Resources
{
    public class BlogResource
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string TextPlain { get; set; }
        public bool IsHidden { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Thumbnail {  get; set; }
        public UserResource User { get; set; }
    }
}
