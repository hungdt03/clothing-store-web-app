namespace back_end.Core.Requests
{
    public class ProductFilterRequest
    {
        public List<int>? ColorIds { get; set; }
        public List<int>? SizeIds { get; set; }
        public List<int>? BrandIds { get; set; }
        public List<int>? CategoryIds { get; set; }
        public double? MinPrice { get; set; }
        public double? MaxPrice { get; set; }
    }
}
