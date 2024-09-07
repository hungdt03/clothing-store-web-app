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
    public class AddressOrderController : ControllerBase
    {
        private readonly IAddressOrderService _addressOrderService;

        public AddressOrderController(IAddressOrderService addressOrderService)
        {
            _addressOrderService = addressOrderService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateAddressOrder([FromBody] AddressOrderRequest request)
        {
            var response = await _addressOrderService.CreateAddressOrder(request);
            return Ok(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAdderssOrdersByUser()
        {
            var response = await _addressOrderService.GetAllByUsers();
            return Ok(response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> SetAddressStatus([FromRoute] int id)
        {
            var response = await _addressOrderService.SetCheckedDefault(id);
            return Ok(response);
        }
    }
}
