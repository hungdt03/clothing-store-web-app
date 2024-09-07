using back_end.Core.Requests;
using back_end.Core.Responses;

namespace back_end.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<BaseResponse> CreateCategory(CategoryRequest request);
        Task<BaseResponse> UpdateCategory(int id, CategoryRequest request);
        Task<BaseResponse> GetCategoryById(int id);
        Task<BaseResponse> GetAllCategories(int pageIndex, int pageSize, string searchString);
        Task<BaseResponse> GetAllCategoriesByLevel();
        Task RemoveCategory(int id);
    }
}
