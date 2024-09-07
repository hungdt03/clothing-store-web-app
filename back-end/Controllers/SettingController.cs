using back_end.Core.Requests;
using back_end.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers
{
    [Authorize(Roles = "ADMIN")]
    [Route("api/[controller]")]
    [ApiController]
    public class SettingController : ControllerBase
    {
        private readonly ISlideShowService _slideShowService;
        private readonly IReviewShowService _reviewShowService;

        public SettingController(ISlideShowService slideShowService, IReviewShowService reviewShowService)
        {
            _slideShowService = slideShowService;
            _reviewShowService = reviewShowService;
        }

        [AllowAnonymous]
        [HttpGet("slide-show")]
        public async Task<IActionResult> GetAllSlideShows()
        {
            var response = await _slideShowService.GetAllSlideShows();
            return Ok(response);
        }

        [AllowAnonymous]
        [HttpGet("review-show")]
        public async Task<IActionResult> GetAllReviewShows()
        {
            var response = await _reviewShowService.GetAllReviewShows();
            return Ok(response);
        }

        [HttpPost("slide-show")]
        public async Task<IActionResult> CreateSlideShow([FromForm] CreateSlideShowRequest request)
        {
            var response = await _slideShowService.CreateSlideShow(request);
            return Ok(response);
        }

        [HttpPut("slide-show/{id}")]
        public async Task<IActionResult> EditSlideShow([FromRoute] int id, [FromForm] EditSlideShowRequest request)
        {
            await _slideShowService.EditSlideShow(id, request);
            return NoContent();
        }

        [HttpDelete("slide-show/{id}")]
        public async Task<IActionResult> RemoveSlideShow([FromRoute] int id)
        {
            await _slideShowService.RemoveSlideShow(id);
            return NoContent();
        }

        [HttpPost("review-show")]
        public async Task<IActionResult> CreateReviewShow([FromBody] ReviewShowRequest request)
        {
            var response = await _reviewShowService.CreateReviewShow(request);
            return Ok(response);
        }

        [HttpDelete("review-show/{id}")]
        public async Task<IActionResult> EditReviewShow([FromRoute] int id)
        {
            await _reviewShowService.RemoveReviewShow(id);
            return NoContent();
        }
    }
}
