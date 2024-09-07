using back_end.Core.Responses.Resources;

namespace back_end.Core.Responses.Report
{
    public class ProductReport
    {
        public ProductResource Product { get; set; }
        public int Quantity { get; set; }
    }
}
