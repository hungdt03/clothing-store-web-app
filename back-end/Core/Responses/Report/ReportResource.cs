using back_end.Core.Responses.Resources;

namespace back_end.Core.Responses.Report
{
    public class ReportResource
    {
        public int Products { get; set; }
        public int Categories { get; set; }
        public int Orders { get; set; }
        public int Accounts { get; set; }
        public List<OrderResource> NewestOrders { get; set; }
    }
}
