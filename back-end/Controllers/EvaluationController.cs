using back_end.Core.Requests;
using back_end.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.InteropServices;

namespace back_end.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class EvaluationController : ControllerBase
    {
        private readonly IEvaluationService evaluationService;

        public EvaluationController(IEvaluationService evaluationService)
        {
            this.evaluationService = evaluationService;
        }

        [Authorize(Roles = "ADMIN")]
        [HttpGet("excellent")]
        public async Task<IActionResult> GetAllExcellentEvaluations()
        {
            var response = await evaluationService.GetAllExcellentEvaluation();
            return Ok(response);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateEvaluation([FromBody] EvaluationRequest request)
        {
            var response = await evaluationService.CreateEvaluation(request);
            return Ok(response);
        }

        [HttpGet("{productId}")]
        public async Task<IActionResult> GetAllByProductId([FromRoute] int productId, [FromQuery] int pageIndex = 1, [FromQuery] int pageSize = 10)
        {
            var response = await evaluationService.GetAllByProductId(productId, pageIndex, pageSize);
            return Ok(response);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> InteractiveEvaluation([FromRoute] int id)
        {
            await evaluationService.InteractEvaluation(id);
            return NoContent();
        }
    }
}
