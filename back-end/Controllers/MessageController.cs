using back_end.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly IMessageService messageService;

        public MessageController(IMessageService messageService)
        {
            this.messageService = messageService;
        }

        [HttpGet("{recipientId}")]
        public async Task<IActionResult> GetAllMessages([FromRoute] string recipientId)
        {
            var response = await messageService.GetAllMessages(recipientId);
            return Ok(response);
        }
    }
}
