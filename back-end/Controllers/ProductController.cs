using back_end.Core.Attributes;
using back_end.Core.Requests;
using back_end.Infrastructures.Caching;
using back_end.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers
{
    [Authorize(Roles = "ADMIN")]
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService productService;
        private readonly IResponseCacheService responseCacheService;
        private const string PATH_CONTROLLER = "/api/Product";

        public ProductController(IProductService productService, IResponseCacheService responseCacheService) {
            this.productService = productService;
            this.responseCacheService = responseCacheService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromForm] CreateProductRequest request)
        {
            var response = await productService.CreateProduct(request);
            await responseCacheService.RemoveResponseCacheAsync(PATH_CONTROLLER);
            return Ok(response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct([FromRoute] int id, [FromBody] EditProductRequest request)
        {
            await productService.UpdateProduct(id, request);
            await responseCacheService.RemoveResponseCacheAsync(PATH_CONTROLLER);
            return NoContent();
        }

        [AllowAnonymous]
        [HttpGet("top-favorites")]
        public async Task<IActionResult> GetTopFavoriteProducts()
        {
            var response = await productService.GetMostFavoriteProducts();
            return Ok(response);
        }

        [AllowAnonymous]
        [HttpGet("top-best-sellers")]
        public async Task<IActionResult> GetTopBestSellerProducts()
        {
            var response = await productService.GetBestSellerProducts();
            return Ok(response);
        }

        [AllowAnonymous]
        [HttpGet("search")]
        public async Task<IActionResult> SeachProducts([FromQuery] string searchString = "", [FromQuery] int pageIndex = 1, [FromQuery] int pageSize = 6)
        {
            var response = await productService.SearchProduct(searchString, pageIndex, pageSize);
            return Ok(response);
        }

        [HttpPut("upload/thumbnail/{id}")]
        public async Task<IActionResult> UpdateThumbnail([FromRoute] int id, [FromForm] UploadSingleFileRequest request)
        {
            await productService.UploadThumbnail(id, request.File);
            await responseCacheService.RemoveResponseCacheAsync(PATH_CONTROLLER);
            return NoContent();
        }

        [HttpPut("upload/zoom-image/{id}")]
        public async Task<IActionResult> UploadZoomImage([FromRoute] int id, [FromForm] UploadSingleFileRequest request)
        {
            await productService.UploadZoomImage(id, request.File);
            await responseCacheService.RemoveResponseCacheAsync(PATH_CONTROLLER);
            return NoContent();
        }

        [HttpPut("upload/images/{id}")]
        public async Task<IActionResult> UploadImages([FromRoute] int id, [FromForm] UploadFileRequest request)
        {
            await productService.UploadImages(id, request.Files);
            await responseCacheService.RemoveResponseCacheAsync(PATH_CONTROLLER);
            return NoContent();
        }

        [HttpPut("remove-images")]
        public async Task<IActionResult> RemoveImages([FromBody] RemoveImageRequest request)
        {
            await productService.RemoveImages(request.ImageIds);
            await responseCacheService.RemoveResponseCacheAsync(PATH_CONTROLLER);
            return NoContent();
        }

        [AllowAnonymous]
        [HttpGet]
        [Cache(5000)]
        public async Task<IActionResult> GetAllProducts(
            [FromQuery] int pageIndex = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] double minPrice = 0,
            [FromQuery] double maxPrice = 0,
            [FromQuery] string sortBy = null,
            [FromQuery] string sortOrder = null,
            [FromQuery] List<int> brandIds = null,
            [FromQuery] List<int> categoryIds = null,
            [FromQuery] List<int> colorIds = null,
            [FromQuery] List<int> sizeIds = null
        )
        {
           
            var response = await productService.GetAllProducts(pageIndex, pageSize, minPrice, maxPrice, brandIds, categoryIds, colorIds, sizeIds, sortBy, sortOrder);
            return Ok(response);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById([FromRoute] int id)
        {
            var response = await productService.GetProductById(id);
            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveProduct([FromRoute] int id)
        {
            await productService.RemoveProduct(id);
            await responseCacheService.RemoveResponseCacheAsync(PATH_CONTROLLER);
            return NoContent();
        }
    }
}
