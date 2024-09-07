using back_end.Core.Requests;
using back_end.Core.Responses;

namespace back_end.Services.Interfaces
{
    public interface IAddressOrderService
    {
        Task<BaseResponse> CreateAddressOrder(AddressOrderRequest request);
        Task<BaseResponse> GetAllByUsers();
        Task<BaseResponse> SetCheckedDefault(int id);
    }
}
