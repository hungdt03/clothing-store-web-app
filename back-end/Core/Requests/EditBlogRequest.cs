namespace back_end.Core.Requests
{
    public class EditBlogRequest
    {
        public string Content { get; set; }
        public string TextPlain { get; set; }
        public IFormFile? Thumbnail { get; set; }
        public string Title { get; set; }
    }
}
