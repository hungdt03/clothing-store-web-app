using back_end.Core.Requests;
using back_end.Core.Responses;

namespace back_end.Services.Interfaces
{
    public interface IColorService
    {
        Task<BaseResponse> CreateColor(ColorRequest request);
        Task<BaseResponse> UpdateColor(int id, ColorRequest request);
        Task<BaseResponse> GetAllColors();
        Task RemoveColor(int id);
    }
}
