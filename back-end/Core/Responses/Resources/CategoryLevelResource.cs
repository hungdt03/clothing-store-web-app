namespace back_end.Core.Responses.Resources
{
    public class CategoryLevelResource
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<CategoryLevelResource> CategoryChildren { get; set; }
    }
}
