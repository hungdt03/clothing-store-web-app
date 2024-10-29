namespace back_end.Core.Responses.Resources
{
    public class ProductResource
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public double OldPrice { get; set; }
        public double Price { get; set; }
        public double PurchasePrice { get; set; }
        public int Quantity { get; set; }
        public CategoryResource Category { get; set; }
        public BrandResource Brand { get; set; }
        public string Thumbnail { get; set; }
        public string ZoomImage { get; set; }
        public List<ProductImageResource> Images { get; set; }
    }
}
