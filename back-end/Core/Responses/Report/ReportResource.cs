using back_end.Core.Responses.Resources;

namespace back_end.Core.Responses.Report
{
    public class ReportResource
    {
        public int Products { get; set; }
        public int Orders { get; set; }
        public double TotalRevenue { get; set; }
        public double Profit { get; set; }
        public double TotalCost { get; set; }
        public List<OrderResource> NewestOrders { get; set; }
    }
}
