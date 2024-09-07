using back_end.Core.Constants;

namespace back_end.Core.Responses.Report
{
    public class OrderReportByMonth
    {
        public int Total { get; set; }
        public string OrderStatus { get; set; }
        public double Percent {  get; set; }
    }
}
