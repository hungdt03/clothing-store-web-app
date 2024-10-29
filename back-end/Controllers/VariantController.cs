using Azure.Core;
using back_end.Core.Requests;
using back_end.Services.Implements;
using back_end.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VariantController : ControllerBase
    {
        private readonly IVariantService variantService;

        public VariantController(IVariantService variantService)
        {
            this.variantService = variantService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllVariants([FromQuery] int pageIndex = 1, [FromQuery] int pageSize = 8, [FromQuery] string searchString = "")
        {
            var response = await variantService.GetAllVariants(pageIndex, pageSize, searchString);
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetVariantById([FromRoute] int id)
        {
            var response = await variantService.GetVariantById(id);
            return Ok(response);
        }

        [HttpGet("product/{productId}")]
        public async Task<IActionResult> GetAllVariantsByProductId([FromRoute] int productId, [FromQuery] int pageIndex = 1, [FromQuery] int pageSize = 8, [FromQuery] string searchString = "")
        {
            var response = await variantService.GetAllVariantsByProductId(productId, pageIndex, pageSize, searchString);
            return Ok(response);
        }

        [HttpGet("product/{productId}/{colorId}")]
        public async Task<IActionResult> GetAllVariantsByProductIdAndColorId([FromRoute] int productId, [FromRoute] int colorId)
        {
            var response = await variantService.GetAllVariantsByProductIdAndColorId(productId, colorId);
            return Ok(response);
        }

        [HttpGet("product-unique-color/{productId}")]
        public async Task<IActionResult> GetUniqueColorVariantsByProductId([FromRoute] int productId)
        {
            var response = await variantService.GetUniqueColorVariantsByProductId(productId);
            return Ok(response);
        }

        [HttpGet("product-unique-size/{productId}")]
        public async Task<IActionResult> GetUniqueSizeVariantsByProductId([FromRoute] int productId)
        {
            var response = await variantService.GetUniqueSizeVariantsByProductId(productId);
            return Ok(response);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPost]
        public async Task<IActionResult> CreateVariant([FromForm] VariantRequest request)
        {
            var response = await variantService.CreateVariant(request);
            return Ok(response);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVariant([FromRoute] int id, [FromBody] EditVariantRequest request)
        {
            await variantService.UpdateVariant(id, request);
            return NoContent();
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPut("upload/thumbnail/{id}")]
        public async Task<IActionResult> UpdateThumbnail([FromRoute] int id, [FromForm] UploadSingleFileRequest request)
        {
            await variantService.UploadThumbnail(id, request.File);
            return NoContent();
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPut("upload/images/{id}")]
        public async Task<IActionResult> UploadImages([FromRoute] int id, [FromForm] UploadFileRequest request)
        {
            await variantService.UploadImages(id, request.Files);
            return NoContent();
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPut("remove-images")]
        public async Task<IActionResult> RemoveImages([FromBody] RemoveImageRequest request)
        {
            await variantService.RemoveImages(request.ImageIds);
            return NoContent();
        }

        [Authorize(Roles = "ADMIN")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveVariant([FromRoute] int id)
        {
            await variantService.RemoveVariant(id);
            return NoContent();
        }
    }
}
