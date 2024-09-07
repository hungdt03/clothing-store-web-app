using back_end.Core.Requests;
using back_end.Infrastructures.FCM;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DeviceTokenController : ControllerBase
    {
        private readonly IFcmService fcmService;    

        public DeviceTokenController(IFcmService fcmService)
        {
            this.fcmService = fcmService;
        }

        [HttpPost]
        public async Task<IActionResult> SaveToken([FromBody] DeviceTokenRequest request)
        {
            await fcmService.SaveTokenDevice(request);
            return Ok();
        }
    }
}
