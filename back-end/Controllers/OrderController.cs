using Azure.Core;
using back_end.Core.Requests;
using back_end.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService orderService;

        public OrderController(IOrderService orderService)
        {
            this.orderService = orderService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderRequest request)
        {
            var response = await orderService.CreateOrder(request); 
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById([FromRoute] int id)
        {
            var response = await orderService.GetOrderById(id);
            return Ok(response);
        }

        [HttpPost("paypal")]
        public async Task<IActionResult> CreateOrderWithPaypal([FromBody] PaypalOrderRequest request, CancellationToken cancellationToken)
        {
            var response = await orderService.CreateOrderWithPaypal(request);
            return Ok(response);
        }

        [HttpGet("user")]
        public async Task<IActionResult> GetAllOrdersByUser([FromQuery] int pageIndex = 1, [FromQuery] int pageSize = 10, [FromQuery] string status = "Tất cả")
        {
            var response = await orderService.GetAllOrdersByUser(pageIndex, pageSize, status);
            return Ok(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllOrders([FromQuery] int pageIndex = 1, [FromQuery] int pageSize = 10, [FromQuery] string status = "Tất cả", [FromQuery] string name = "")
        {
            var response = await orderService.GetAllOrders(pageIndex, pageSize, status, name);
            return Ok(response);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPut("update/{id}/confirmed")]
        public async Task<IActionResult> UpdateStatusOrderToConfirmed([FromRoute] int id)
        {
            await orderService.UpdateStatusOrderToConfirmed(id);
            return NoContent();
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPut("update/{id}/rejected")]
        public async Task<IActionResult> UpdateStatusOrderToRejected([FromRoute] int id)
        {
            await orderService.UpdateStatusOrderToRejected(id);
            return NoContent();
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPut("update/{id}/delivering")]
        public async Task<IActionResult> UpdateStatusOrderToDelivering([FromRoute] int id)
        {
            await orderService.UpdateStatusOrderToDelivering(id);
            return NoContent();
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPut("update/{id}/delivered")]
        public async Task<IActionResult> UpdateStatusOrderToDelivered([FromRoute] int id)
        {
            await orderService.UpdateStatusOrderToDelivered(id);
            return NoContent();
        }
    }
}
