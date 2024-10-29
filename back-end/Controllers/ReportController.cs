using back_end.Core.Responses;
using back_end.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers
{
    [Authorize(Roles = "ADMIN")]
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly IReportService reportService;

        public ReportController(IReportService reportService)
        {
            this.reportService = reportService;
        }

        [HttpGet]
        [ProducesResponseType(200)]
        public async Task<BaseResponse> GetReportData([FromQuery] string type, [FromQuery] DateTime? from, [FromQuery] DateTime? to)
        {
            
            var response = await reportService.GetReportData(type, from, to);
            return response;
        }

        [HttpGet("order/year")]
        [ProducesResponseType(200)]
        public async Task<BaseResponse> GetOrderPercentInYear([FromQuery] int year)
        {
            return await reportService.GetOrderPercentInRangeYear(year);
        }

        [HttpGet("order/month")]
        [ProducesResponseType(200)]
        public async Task<BaseResponse> GetOrderByMonth([FromQuery] DateTime? month)
        {
            if(!month.HasValue)
                return await reportService.GetOrderByMonth(DateTime.Now);
            return await reportService.GetOrderByMonth(month.Value);
        }

        [HttpGet("top-product")]
        [ProducesResponseType(200)]
        public async Task<BaseResponse> GetTopFiveBestSellerProducts([FromQuery] DateTime? fromTime, [FromQuery] DateTime? toTime)
        {
            if(!fromTime.HasValue && !toTime.HasValue)
            {
                return await reportService.GetTopFiveBestSellerProducts(null, DateTime.Now);
            }

            return await reportService.GetTopFiveBestSellerProducts(fromTime, toTime);
        }
    }
}
