using back_end.Core.Requests;
using back_end.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BrandController : ControllerBase
    {
        private readonly IBrandService brandService;

        public BrandController(IBrandService brandService)
        {
            this.brandService = brandService;
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPost]
        public async Task<IActionResult> CreateBrand([FromBody] BrandRequest request)
        {
            var response = await brandService.CreateBrand(request);
            return Ok(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBrands([FromQuery] int pageIndex = 1, [FromQuery] int pageSize = 8, [FromQuery] string searchString = "")
        {
            var response = await brandService.GetAllBrands(pageIndex, pageSize, searchString);
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBrandById([FromRoute] int id)
        {
            var response = await brandService.GetBrandById(id);
            return Ok(response);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBrand([FromRoute] int id, [FromBody] BrandRequest request)
        {
            var response = await brandService.UpdateBrand(id, request);
            return Ok(response);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveBrand([FromRoute] int id)
        {
            await brandService.RemoveBrand(id);
            return NoContent();
        }
    }
}
