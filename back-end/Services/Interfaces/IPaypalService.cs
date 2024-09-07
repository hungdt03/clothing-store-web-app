using back_end.Core.Requests;
using back_end.Core.Responses;

namespace back_end.Services.Interfaces
{
    public interface IPaypalService
    {
        Task<BaseResponse> CaptureOrder(string orderId, OrderRequest request);
    }
}

