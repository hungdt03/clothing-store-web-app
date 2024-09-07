namespace back_end.Core.Responses.Resources
{
    public class CategoryResource
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public CategoryResource ParentCategory { get; set; }
    }
}
