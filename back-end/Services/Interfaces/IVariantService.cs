using back_end.Core.Requests;
using back_end.Core.Responses;

namespace back_end.Services.Interfaces
{
    public interface IVariantService
    {
        Task<BaseResponse> CreateVariant(VariantRequest request);
        Task<BaseResponse> GetAllVariants(int pageIndex, int pageSize, string searchString);
        Task<BaseResponse> GetVariantById(int id);
        Task UpdateVariant(int id, EditVariantRequest request);
        Task UploadThumbnail(int id, IFormFile file);
        Task UploadImages(int id, List<IFormFile> files);
        Task RemoveImages(List<int> ids);
        Task RemoveVariant(int id);
        Task<BaseResponse> GetAllVariantsByProductId(int productId, int pageIndex, int pageSize, string searchString);
        Task<BaseResponse> GetAllVariantsByProductIdAndColorId(int productId, int colorId);
        Task<BaseResponse> GetUniqueColorVariantsByProductId(int productId);
        Task<BaseResponse> GetUniqueSizeVariantsByProductId(int productId);
    }
}
