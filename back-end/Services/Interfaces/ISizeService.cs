using back_end.Core.Requests;
using back_end.Core.Responses;

namespace back_end.Services.Interfaces
{
    public interface ISizeService
    {
        Task<BaseResponse> CreateSize(SizeRequest request);
        Task<BaseResponse> UpdateSize(int id, SizeRequest request);
        Task<BaseResponse> GetAllSizes();
        Task RemoveSize(int id);
    }
}
