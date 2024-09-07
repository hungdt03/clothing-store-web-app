using back_end.Core.Constants;
using back_end.Core.Models;
using back_end.Core.Requests;
using back_end.Core.Responses;
using back_end.Core.Responses.Resources;
using back_end.Data;
using back_end.Exceptions;
using back_end.Helpers;
using back_end.Mappers;
using back_end.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace back_end.Services.Implements
{
    public class PaypalService : IPaypalService
    {
        private readonly PaypalClient _paypalClient;    
        private readonly MyStoreDbContext dbContext;
        private readonly ApplicationMapper applicationMapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public PaypalService(PaypalClient paypalClient, MyStoreDbContext storeContext, ApplicationMapper applicationMapper, IHttpContextAccessor httpContextAccessor)
        {
            _paypalClient = paypalClient;
            dbContext = storeContext;
            this.applicationMapper = applicationMapper;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<BaseResponse> CaptureOrder(string orderId, OrderRequest request)
        {
            try
            {
                var paypalResponse = await _paypalClient.CaptureOrder(orderId);
                var reference = paypalResponse.purchase_units[0].reference_id;

                Order order = await CreateOrder(request);
                order.Payment.PaymentCode = reference;
                var savedOrder = await dbContext.Orders.AddAsync(order);
                await dbContext.SaveChangesAsync();

                var response = new DataResponse<OrderResource>();
                response.Message = "Đặt hàng thành công";
                response.StatusCode = System.Net.HttpStatusCode.OK;
                response.Success = true;
                response.Data = applicationMapper.MapToOrderResource(savedOrder.Entity);

                return response;
            } catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        private async Task<Order> CreateOrder(OrderRequest request)
        {
            AddressOrder? addressOrder = await dbContext.AddressOrders
                .SingleOrDefaultAsync(ad => ad.Id == request.AddressOrderId)
                    ?? throw new NotFoundException("Địa chỉ giao hàng không tồn tại");

            Order order = new Order();
            order.OrderNote = request.Note;
            order.CreatedAt = DateTime.Now;
            order.OrderStatus = OrderStatus.CONFIRMED;
            order.OrderItems = new List<OrderItem>();

            order.OrderHistories.Add(new OrderHistory
            {
                OrderStatus = OrderStatus.CONFIRMED,
                ModifyAt = DateTime.Now,
                Note = "Bạn đã thanh toán đơn hàng qua Paypal",
            });

            order.UserId = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Sid).Value;
            order.AddressOrderId = request.AddressOrderId;
            order.Payment = new Payment()
            {
                CreatedDate = DateTime.Now,
                PaymentMethod = "Paypal",
                PaymentDate = DateTime.Now,
                Status = false
            };

            double total = 0;

            foreach (var item in request.Items)
            {
                ProductVariant? productVariant = await dbContext.ProductVariants
                    .Include(p => p.Product)
                    .SingleOrDefaultAsync(p => p.Id == item.VariantId)
                        ?? throw new NotFoundException("Không tìm thấy sản phẩm");

                OrderItem orderItem = new OrderItem();
                orderItem.ProductVariantId = item.VariantId;
                orderItem.Quantity = item.Quantity;
                orderItem.Price = productVariant!.Product!.Price;

                double subTotal = item.Quantity * productVariant.Product.Price;
                orderItem.SubTotal = subTotal;
                total += subTotal;
                order.OrderItems.Add(orderItem);
            }

            order.TotalPrice = total;
            order.Quantity = request.Items.Count;

            return order;
        }
    }
}
