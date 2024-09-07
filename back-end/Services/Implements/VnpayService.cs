using back_end.Core.Constants;
using back_end.Core.Models;
using back_end.Core.Requests;
using back_end.Core.Responses;
using back_end.Data;
using back_end.Exceptions;
using back_end.Helpers;
using back_end.Mappers;
using back_end.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace back_end.Services.Implements
{
    public class VnpayService : IVnpayService
    {
        private readonly IConfiguration _config;
        private readonly MyStoreDbContext dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ApplicationMapper _applicationMapper;

        public VnpayService(IConfiguration config, MyStoreDbContext dbContext, IHttpContextAccessor httpContextAccessor, ApplicationMapper applicationMapper)
        {
            _config = config;
            this.dbContext = dbContext;
            _httpContextAccessor = httpContextAccessor;
            _applicationMapper = applicationMapper;
        }

        public async Task<BaseResponse> CreatePaymentUrl(HttpContext context, OrderRequest request)
        {
            Order order = await createOrder(request);
            var tick = DateTime.Now.Ticks.ToString();

            var vnpay = new VnPayLibrary();
            vnpay.AddRequestData("vnp_Version", _config["VnPay:Version"]);
            vnpay.AddRequestData("vnp_Command", _config["VnPay:Command"]);
            vnpay.AddRequestData("vnp_TmnCode", _config["VnPay:TmnCode"]);
            vnpay.AddRequestData("vnp_Amount", (order.TotalPrice * 100).ToString()); 

            vnpay.AddRequestData("vnp_CreateDate", order.CreatedAt.ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_CurrCode", _config["VnPay:CurrCode"]);
            vnpay.AddRequestData("vnp_IpAddr", Utils.GetIpAddress(context));
            vnpay.AddRequestData("vnp_Locale", _config["VnPay:Locale"]);

            vnpay.AddRequestData("vnp_OrderInfo", "Thanh toán cho đơn hàng:" + order.Id);
            vnpay.AddRequestData("vnp_OrderType", "other");
            vnpay.AddRequestData("vnp_ReturnUrl", _config["VnPay:PaymentBackReturnUrl"]);

            vnpay.AddRequestData("vnp_TxnRef", order.Id + "#" + tick); 

            var paymentUrl = vnpay.CreateRequestUrl(_config["VnPay:BaseUrl"], _config["VnPay:HashSecret"]);


            var response = new DataResponse<string>();
            response.Message = "Tạo đơn thanh toán thành công";
            response.StatusCode = System.Net.HttpStatusCode.OK;
            response.Success = true;
            response.Data = paymentUrl;

            return response;
        }

        private async Task<Order> createOrder(OrderRequest request)
        {
            AddressOrder? addressOrder = await dbContext.AddressOrders
                .SingleOrDefaultAsync(ad => ad.Id == request.AddressOrderId)
                    ?? throw new NotFoundException("Địa chỉ giao hàng không tồn tại");

            Order order = new Order();
            order.OrderNote = request.Note;
            order.CreatedAt = DateTime.Now;
            order.OrderStatus = OrderStatus.WAITING_PAYMENT;
            order.OrderHistories.Add(new OrderHistory
            {
                OrderStatus = OrderStatus.WAITING_PAYMENT,
                ModifyAt = DateTime.Now,
                Note = "Bạn đã đặt một đơn hàng mới",
            });

          
            order.OrderItems = new List<OrderItem>();

            order.UserId = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Sid).Value;
            order.AddressOrderId = request.AddressOrderId;
            order.Payment = new Payment()
            {
                CreatedDate = DateTime.Now,
                PaymentMethod = "VNPAY",
                PaymentCode = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Sid).Value,
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

            var savedOrder = await dbContext.Orders.AddAsync(order);
            await dbContext.SaveChangesAsync();

            return savedOrder.Entity;
        }

        public async Task<Order> PaymentExecute(IQueryCollection collections)
        {
            var vnpay = new VnPayLibrary();
            foreach (var (key, value) in collections)
            {
                if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
                {
                    vnpay.AddResponseData(key, value.ToString());
                }
            }

            var vnp_orderId = vnpay.GetResponseData("vnp_TxnRef");
            var vnp_TransactionId = Convert.ToInt64(vnpay.GetResponseData("vnp_TransactionNo"));
            var vnp_SecureHash = collections.FirstOrDefault(p => p.Key == "vnp_SecureHash").Value;
            var vnp_ResponseCode = vnpay.GetResponseData("vnp_ResponseCode");
            var vnp_OrderInfo = vnpay.GetResponseData("vnp_OrderInfo");

            bool checkSignature = vnpay.ValidateSignature(vnp_SecureHash, _config["VnPay:HashSecret"]);
            if (!checkSignature || vnp_ResponseCode != "00")
                throw new Exception($"Lỗi thanh toán VNPAY {vnp_ResponseCode}");

            var orderId = int.Parse(vnp_orderId.Split("#")[0]);
            var order = await dbContext.Orders
                .Include(o => o.Payment)
                .Include(o => o.AddressOrder)
                .Include(o => o.User)
                .SingleOrDefaultAsync(o => o.Id == orderId)
                    ?? throw new NotFoundException("Đơn hàng không tồn tại");

            order.Payment.Status = true;
            order.OrderHistories.Add(new OrderHistory
            {
                OrderStatus = OrderStatus.CONFIRMED,
                ModifyAt = DateTime.Now,
                Note = "Bạn đã thanh toán đơn hàng qua VNPAY",
            });
            order.OrderStatus = OrderStatus.CONFIRMED;
            order.Payment.PaymentCode = vnp_TransactionId.ToString();
            order.Payment.PaymentMethod = "VNPAY";
            order.Payment.PaymentDate = DateTime.Now;

            await dbContext.SaveChangesAsync();
            return order;
        }
    }
}
