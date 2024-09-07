using back_end.Core.Requests;
using back_end.Core.Responses;
using back_end.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly IBlogService blogService;

        public BlogController(IBlogService blogService)
        {
            this.blogService = blogService;
        }

        [HttpGet]
        [ProducesResponseType(200)]
        public async Task<BaseResponse> GetAll()
        {
            var response = await blogService.GetAllBlogs();
            return response;
        }

        [HttpGet("related/{userId}/{blogId}")]
        [ProducesResponseType(200)]
        public async Task<BaseResponse> GetAllBlogsRelatedUser([FromRoute] string userId, [FromRoute] int blogId)
        {
            var response = await blogService.GetAllBlogsRelatedUser(userId, blogId);
            return response;
        }

        [HttpGet("except/{blogId}")]
        [ProducesResponseType(200)]
        public async Task<BaseResponse> GetAllBlogsExceptBlogId([FromRoute] int blogId)
        {
            var response = await blogService.GetAllBlogsExceptCurrentBlog(blogId);
            return response;
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPost]
        [ProducesResponseType(200)]
        public async Task<BaseResponse> CreateBlog([FromForm] CreateBlogRequest request)
        {
            var response = await blogService.CreateBlog(request);
            return response;
        }

        [HttpGet("{id}")]
        [ProducesResponseType(200)]
        public async Task<BaseResponse> GetBlogById([FromRoute] int id)
        {
            var response = await blogService.GetBlogById(id);
            return response;
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPut("{id}")]
        [ProducesResponseType(204)]
        public async Task UpdateBlog([FromRoute] int id, [FromForm] EditBlogRequest request)
        {
            await blogService.UpdateBlog(id, request);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPut("hidden/{id}")]
        [ProducesResponseType(204)]
        public async Task HiddenBlog([FromRoute] int id)
        {
            await blogService.HiddenBlog(id);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPut("show/{id}")]
        [ProducesResponseType(204)]
        public async Task ShowBlog([FromRoute] int id)
        {
            await blogService.ShowBlog(id);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpDelete("{id}")]
        [ProducesResponseType(204)]
        public async Task DeleteBlog([FromRoute] int id)
        {
            await blogService.DeleteBlog(id);
        }
    }
}
