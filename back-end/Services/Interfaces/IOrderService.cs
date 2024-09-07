using back_end.Core.Requests;
using back_end.Core.Responses;
using back_end.Helpers;

namespace back_end.Services.Interfaces
{
    public interface IOrderService
    {
        Task<BaseResponse> CreateOrder(OrderRequest request);
        Task<CreateOrderResponse> CreateOrderWithPaypal(PaypalOrderRequest request);
        Task<BaseResponse> GetAllOrdersByUser(int pageIndex, int pageSize, string status);
        Task<BaseResponse> GetAllOrders(int pageIndex, int pageSize, string status, string name);
        Task<BaseResponse> GetOrderById(int id);
        Task UpdateStatusOrderToConfirmed(int id);
        Task UpdateStatusOrderToRejected(int id);
        Task UpdateStatusOrderToDelivering(int id);
        Task UpdateStatusOrderToDelivered(int id);
    }
}
