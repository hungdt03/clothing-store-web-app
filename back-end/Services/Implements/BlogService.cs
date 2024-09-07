using back_end.Core.Models;
using back_end.Core.Requests;
using back_end.Core.Responses;
using back_end.Core.Responses.Resources;
using back_end.Data;
using back_end.Exceptions;
using back_end.Extensions;
using back_end.Infrastructures.Cloudinary;
using back_end.Mappers;
using back_end.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace back_end.Services.Implements
{
    public class BlogService : IBlogService
    {
        private readonly MyStoreDbContext dbContext;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly ApplicationMapper applicationMapper;
        private readonly IUploadService uploadService;

        public BlogService(MyStoreDbContext dbContext, IHttpContextAccessor httpContextAccessor, ApplicationMapper applicationMapper, IUploadService uploadService)
        {
            this.dbContext = dbContext;
            this.httpContextAccessor = httpContextAccessor;
            this.applicationMapper = applicationMapper;
            this.uploadService = uploadService;
        }

        public async Task<BaseResponse> CreateBlog(CreateBlogRequest request)
        {
            var userId = httpContextAccessor.HttpContext.User.GetUserId();
            Blog blog = new Blog();
            blog.Title = request.Title;
            blog.UserId = userId;
            blog.TextPlain = request.TextPlain;
            blog.CreatedDate = DateTime.Now;
            blog.Content = request.Content;
            var thumbnail = await uploadService.UploadSingleFileAsync(request.Thumbnail);
            blog.Thumbnail = thumbnail;

            await dbContext.Blogs.AddAsync(blog);
            await dbContext.SaveChangesAsync();

            var response = new BaseResponse();
            response.Message = "Tạo một bài viết mới thành công";
            response.Success = true;
            response.StatusCode = System.Net.HttpStatusCode.OK;

            return response;
        }

        public async Task DeleteBlog(int blogId)
        {
            Blog blog = await dbContext.Blogs
                .Where(b => !b.IsDeleted)
                .SingleOrDefaultAsync(b => b.Id == blogId)
                    ?? throw new NotFoundException("Không tìm thấy bài viết nào");
            blog.IsDeleted = true;
            int rows = await dbContext.SaveChangesAsync();
            if (rows == 0) throw new Exception("Không thể xóa bài viết");
        }

        public async Task<BaseResponse> GetAllBlogs()
        {
            var blogs = await dbContext.Blogs
                .Where(b => !b.IsDeleted)
                .Include(b => b.User)
                .ToListAsync();

            var resources = blogs.Select(blog => applicationMapper.MapToBlogResource(blog)).ToList();

            var response = new DataResponse<List<BlogResource>>()
            {
                Data = resources,
                Message = "Lấy tất cả bài viết thành công",
                Success = true,
                StatusCode = System.Net.HttpStatusCode.OK
            };

            return response;
        }

        public async Task<BaseResponse> GetAllBlogsExceptCurrentBlog(int blogId)
        {
            var blogs = await dbContext.Blogs
                .Where(b => !b.IsDeleted)
                .Include(b => b.User)
                .Where(b => b.Id != blogId)
                .ToListAsync();

            var resources = blogs.Select(blog => applicationMapper.MapToBlogResource(blog)).ToList();

            var response = new DataResponse<List<BlogResource>>()
            {
                Data = resources,
                Message = "Lấy tất cả bài viết thành công",
                Success = true,
                StatusCode = System.Net.HttpStatusCode.OK
            };

            return response;
        }

        public async Task<BaseResponse> GetAllBlogsRelatedUser(string userId, int blogId)
        {
            var blogs = await dbContext.Blogs
                .Where(b => !b.IsDeleted)
                .Include(b => b.User)
                .Where(b => b.UserId == userId && b.Id != blogId)
                .ToListAsync();

            var resources = blogs.Select(blog => applicationMapper.MapToBlogResource(blog)).ToList();

            var response = new DataResponse<List<BlogResource>>()
            {
                Data = resources,
                Message = "Lấy tất cả bài viết thành công",
                Success = true,
                StatusCode = System.Net.HttpStatusCode.OK
            };

            return response;
        }

        public async Task<BaseResponse> GetBlogById(int id)
        {
            Blog blog = await dbContext.Blogs.Where(b => !b.IsDeleted)
                .Include(blog => blog.User)
                .SingleOrDefaultAsync(b => b.Id == id)
                    ?? throw new NotFoundException("Không tìm thấy bài viết nào");


            var resources = applicationMapper.MapToBlogResource(blog);

            var response = new DataResponse<BlogResource>()
            {
                Data = resources,
                Message = "Lấy bài viết thành công",
                Success = true,
                StatusCode = System.Net.HttpStatusCode.OK
            };

            return response;
        }

        public async Task HiddenBlog(int blogId)
        {
            Blog blog = await dbContext.Blogs
                .Where(b => !b.IsDeleted)
                .SingleOrDefaultAsync(b => b.Id == blogId)
                    ?? throw new NotFoundException("Không tìm thấy bài viết nào");
            blog.IsHidden = true;
            int rows = await dbContext.SaveChangesAsync();
            if (rows == 0) throw new Exception("Không thể ẩn bài viết");
        }

        public async Task ShowBlog(int blogId)
        {
            Blog blog = await dbContext.Blogs
                .Where(b => !b.IsDeleted)
                .SingleOrDefaultAsync(b => b.Id == blogId)
                    ?? throw new NotFoundException("Không tìm thấy bài viết nào");
            blog.IsHidden = false;
            int rows = await dbContext.SaveChangesAsync();
            if (rows == 0) throw new Exception("Không thể bỏ ẩn bài viết");
        }

        public async Task UpdateBlog(int id, EditBlogRequest request)
        {
            Blog blog = await dbContext.Blogs.Where(b => !b.IsDeleted)
                .Include(blog => blog.User)
                .SingleOrDefaultAsync(b => b.Id == id)
                    ?? throw new NotFoundException("Không tìm thấy bài viết nào");

            blog.Title = request.Title;
            blog.TextPlain = request.TextPlain;
            blog.Content = request.Content;

            if(request.Thumbnail != null)
            {
                var thumbnail = await uploadService.UploadSingleFileAsync(request.Thumbnail);
                blog.Thumbnail = thumbnail;
            }

            int rowChanges = await dbContext.SaveChangesAsync();

            if (rowChanges == 0) throw new Exception("Cập nhật bài viết thất bại");

        }
    }
}
