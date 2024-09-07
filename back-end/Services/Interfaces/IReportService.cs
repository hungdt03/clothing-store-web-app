using back_end.Core.Responses;

namespace back_end.Services.Interfaces
{
    public interface IReportService
    {
        Task<BaseResponse> GetReportData();
        Task<BaseResponse> GetTopFiveBestSellerProducts(DateTime? fromTime, DateTime? toTime);
        Task<BaseResponse> GetOrderPercentInRangeYear(int year);
        Task<BaseResponse> GetOrderByMonth(DateTime time);
    }
}
