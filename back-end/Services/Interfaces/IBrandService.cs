using back_end.Core.Requests;
using back_end.Core.Responses;

namespace back_end.Services.Interfaces
{
    public interface IBrandService
    {
        Task<BaseResponse> CreateBrand(BrandRequest request);
        Task<BaseResponse> UpdateBrand(int id, BrandRequest request);
        Task<BaseResponse> GetBrandById(int id);
        Task<BaseResponse> GetAllBrands(int pageIndex, int pageSize, string searchString);
        Task RemoveBrand(int id);
    }
}
