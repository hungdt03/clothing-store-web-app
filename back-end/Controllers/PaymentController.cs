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
    public class PaymentController : ControllerBase
    {
        private readonly IVnpayService vnpayService;
        private readonly IPaypalService paypalService;

        public PaymentController(IVnpayService vnpayService, IPaypalService paypalService)
        {
            this.vnpayService = vnpayService;
            this.paypalService = paypalService;
        }

        [HttpGet("vnpay-callback")]
        public async Task<IActionResult> VnpayCallback()
        {
            var response = await vnpayService.PaymentExecute(Request.Query);
            var externalUrl = $"http://localhost:5173/result/order-success?orderId={response.Id}&status=success";
            return Redirect(externalUrl);
            
        }

        [Authorize]
        [HttpPost("create-vnpay-payment")]
        public async Task<IActionResult> CreateVnpayPayment([FromBody] OrderRequest request)
        {
            var response = await vnpayService.CreatePaymentUrl(HttpContext, request);
            return Ok(response);
        }

        [HttpPost("capture/{orderId}")]
        public async Task<IActionResult> PaypalCapture([FromRoute] string orderId, [FromBody] OrderRequest orderRequest, CancellationToken cancellationToken)
        {
            var response = await paypalService.CaptureOrder(orderId, orderRequest);
            return Ok(response);
        }
    }
}
