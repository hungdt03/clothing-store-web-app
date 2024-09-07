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
    public class ColorController : ControllerBase
    {
        private readonly IColorService colorService;

        public ColorController(IColorService colorService)
        {
            this.colorService = colorService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllColors()
        {
            var response = await colorService.GetAllColors();
            return Ok(response);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPost]
        public async Task<IActionResult> CreateColor([FromBody] ColorRequest request)
        {
            var response = await colorService.CreateColor(request); 
            return Ok(response);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateColor([FromRoute] int id, [FromBody] ColorRequest request)
        {
            var response = await colorService.UpdateColor(id, request);
            return Ok(response);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveColor([FromRoute] int id)
        {
            await colorService.RemoveColor(id);
            return NoContent();
        }
    }
}
