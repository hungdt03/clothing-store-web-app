namespace back_end.Core.Responses.Resources
{
    public class VariantResource
    {
        public int Id { get; set; }
        public int InStock { get; set; }
        public ColorResource Color { get; set; }
        public SizeResource Size { get; set; }
        public ProductResource Product { get; set; }
        public string ThumbnailUrl { get; set; }
        public List<ProductImageResource> Images { get; set; }
    }
}
