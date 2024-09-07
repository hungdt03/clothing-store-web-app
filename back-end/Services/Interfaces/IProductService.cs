using back_end.Core.Requests;
using back_end.Core.Responses;

namespace back_end.Services.Interfaces
{
    public interface IProductService
    {
        Task<BaseResponse> CreateProduct(CreateProductRequest request);
        Task UpdateProduct(int id, EditProductRequest request);
        Task<BaseResponse> GetBestSellerProducts();
        Task<BaseResponse> GetMostFavoriteProducts();
        Task<BaseResponse> GetProductById(int id);
        Task UploadThumbnail(int id, IFormFile file);
        Task UploadZoomImage(int id, IFormFile file);
        Task UploadImages(int id, List<IFormFile> files);
        Task RemoveImages(List<int> ids);
        Task RemoveProduct(int id);
        Task<BaseResponse> SearchProduct(string searchValue, int pageIndex, int pageSize);
        Task<BaseResponse> GetAllProducts(int pageIndex, int pageSize, double minPrice, double maxPrice, List<int> brandIds, List<int> categoryIds, List<int> colorIds, List<int> sizeIds, string sortBy, string sortOrder);
    }
}
