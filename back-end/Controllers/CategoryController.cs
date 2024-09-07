using Azure.Core;
using back_end.Core.Requests;
using back_end.Services.Implements;
using back_end.Services.Interfaces;
using back_end.Validation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService categoryService;
        private readonly ILogger<CategoryController> logger;

        public CategoryController(ICategoryService categoryService, ILogger<CategoryController> logger)
        {
            this.categoryService = categoryService;
            this.logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCategories([FromQuery] int pageIndex = 1, [FromQuery] int pageSize = 8, [FromQuery] string searchString = "") {
            logger.LogInformation("Inside Get all category action");
            var response = await categoryService.GetAllCategories(pageIndex, pageSize, searchString ?? "");
            return Ok(response);
        }

        [HttpGet("level")]
        public async Task<IActionResult> GetAllCategoriesByLevel()
        {
            logger.LogInformation("Inside Get all category by level action");
            var response = await categoryService.GetAllCategoriesByLevel();
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoryById([FromRoute] int id)
        {
            logger.LogInformation("Inside Get category By Id action");
            var response = await categoryService.GetCategoryById(id);
            return Ok(response);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPost]
        [ServiceFilter(typeof(CustomValidation))]
        public async Task<IActionResult> CreateCategory([FromBody] CategoryRequest request)
        {
            logger.LogInformation("Inside Create category action");
            var response = await categoryService.CreateCategory(request);
            return Ok(response);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPut("{id}")]
        [ServiceFilter(typeof(CustomValidation))]
        public async Task<IActionResult> UpdateCategory([FromRoute] int id, [FromBody] CategoryRequest request)
        {
            logger.LogInformation("Inside Update category action");
            await categoryService.UpdateCategory(id, request);
            return NoContent();
        }

        [Authorize(Roles = "ADMIN")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveCategory([FromRoute] int id)
        {
            await categoryService.RemoveCategory(id);
            return NoContent();
        }
    }
}
