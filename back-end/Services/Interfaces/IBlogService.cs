using back_end.Core.Requests;
using back_end.Core.Responses;

namespace back_end.Services.Interfaces
{
    public interface IBlogService
    {
        Task<BaseResponse> CreateBlog(CreateBlogRequest request);
        Task UpdateBlog(int id, EditBlogRequest request);
        Task<BaseResponse> GetAllBlogs();
        Task<BaseResponse> GetAllBlogsRelatedUser(string userId, int blogId);
        Task<BaseResponse> GetAllBlogsExceptCurrentBlog(int blogId);
        Task<BaseResponse> GetBlogById(int id);
        Task HiddenBlog(int blogId);
        Task ShowBlog(int blogId);
        Task DeleteBlog(int blogId);
    }
}
