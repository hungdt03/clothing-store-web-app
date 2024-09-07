using back_end.Core.Constants;
using back_end.Core.Models;
using back_end.Core.Requests;
using back_end.Core.Responses;
using back_end.Core.Responses.Resources;
using back_end.Data;
using back_end.Exceptions;
using back_end.Extensions;
using back_end.Helpers;
using back_end.Infrastructures.FCM;
using back_end.Infrastructures.SignalR;
using back_end.Mappers;
using back_end.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace back_end.Services.Implements
{
    public class OrderService : IOrderService
    {
        private const double UsdPrice = 23500;
        private readonly MyStoreDbContext dbContext;
        private readonly ApplicationMapper applicationMapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly PaypalClient _paypalClient;
        private readonly IConfiguration _configuration;
        private readonly IFcmService fcmService;
        private readonly UserManager<User> _userManager;
        private readonly PresenceTracker presenceTracker;
        private readonly IHubContext<ServerHub> hubContext;

        public OrderService(MyStoreDbContext dbContext, IHttpContextAccessor httpContextAccessor, ApplicationMapper mapper, PaypalClient paypalClient, IConfiguration configuration, IFcmService fcmService, UserManager<User> userManager, PresenceTracker presenceTracker, IHubContext<ServerHub> hubContext)
        {
            this.dbContext = dbContext;
            _httpContextAccessor = httpContextAccessor;
            applicationMapper = mapper;
            _paypalClient = paypalClient;
            _configuration = configuration;
            this.fcmService = fcmService;
            _userManager = userManager;
            this.presenceTracker = presenceTracker;
            this.hubContext = hubContext;
        }

        public async Task<BaseResponse> CreateOrder(OrderRequest request)
        {
            AddressOrder? addressOrder = await dbContext.AddressOrders
                .SingleOrDefaultAsync(ad => ad.Id == request.AddressOrderId)
                    ?? throw new NotFoundException("Địa chỉ giao hàng không tồn tại");

            Order order = new Order();
            order.OrderNote = request.Note;
            order.CreatedAt = DateTime.Now;
            order.OrderStatus = OrderStatus.PENDING;
            order.OrderHistories.Add(new OrderHistory
            {
                OrderStatus = OrderStatus.PENDING,
                ModifyAt = DateTime.Now,
                Note = "Bạn đã đặt một đơn hàng",
            });

            order.OrderItems = new List<OrderItem>();
            order.UserId = _httpContextAccessor.HttpContext.User.GetUserId();
            order.AddressOrderId = request.AddressOrderId;
            order.Payment = new Payment()
            {
                CreatedDate = DateTime.Now,
                PaymentMethod = "CASH",
                PaymentCode = _httpContextAccessor.HttpContext.User.GetUserId(),
                Status = false
            };

            double total = 0;
            
            foreach (var item in request.Items)
            {
                ProductVariant? productVariant = await dbContext.ProductVariants
                    .Include(p => p.Product)
                    .SingleOrDefaultAsync(p => p.Id == item.VariantId)
                        ?? throw new NotFoundException("Không tìm thấy sản phẩm");

                productVariant.InStock -= item.Quantity;

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

            var fullName = _httpContextAccessor.HttpContext?.User.GetGivenName();

            var adminUsers = await _userManager.GetUsersInRoleAsync("ADMIN");
            
            foreach(var admin in adminUsers)
            {
                await fcmService.SendNotification(
                    "Đơn hàng mới",
                    $"{fullName} đã đặt một đơn hàng mới",
                    admin.Id,
                    order.Id,
                    NotificationType.ORDER
                );
            }

            var response = new DataResponse<OrderResource>();
            response.Message = "Đặt hàng thành công";
            response.StatusCode = System.Net.HttpStatusCode.OK;
            response.Success = true;
            response.Data = applicationMapper.MapToOrderResource(savedOrder.Entity);

            return response;
        }


        public async Task<CreateOrderResponse> CreateOrderWithPaypal(PaypalOrderRequest request)
        {
            try
            {
                var userId = _httpContextAccessor.HttpContext?.User.GetUserId();
              
                var price = Math.Round(request.TotalPrice / UsdPrice, 2).ToString();
                var currency = "USD";
                var reference = "DH" + DateTime.Now.Ticks.ToString();
                var response = await _paypalClient.CreateOrder(price, currency, reference);

                return response;
            }
            catch (Exception e)
            {
                throw new Exception($"Có lỗi xảy ra: {e.Message}");
            }
        }

        public async Task<BaseResponse> GetAllOrdersByUser(int pageIndex, int pageSize, string status)
        {
            var userId = _httpContextAccessor.HttpContext?.User.GetUserId();
            var totalItems = await dbContext.Orders.Where(o => o.UserId == userId).CountAsync();
            var queryable = dbContext.Orders
                .OrderByDescending(o => o.Id)
                .Where(o => o.UserId == userId)
                .AsQueryable();

            if(status != null && status != "Tất cả")
            {
                queryable = queryable.Where(o => o.OrderStatus.Equals(status));
            }

            var orders = await queryable
                .Include(o => o.AddressOrder)
                .Include(o => o.Payment)
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                    .ThenInclude(o => o.ProductVariant)
                        .ThenInclude(o => o.Product)
                .Skip((pageIndex - 1) * pageSize)
                .Take(pageSize).ToListAsync();

            var response = new PaginationResponse<List<OrderResource>>()
            {
                Data = orders.Select(order => applicationMapper.MapToOrderResource(order)).ToList(),
                Message = "Lấy danh sách đơn hàng thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true,
                Pagination = new Pagination
                {
                    TotalItems = totalItems,
                    TotalPages = (int) Math.Ceiling((double) totalItems / pageSize),
                }
            };

            return response;
        }

        public async Task<BaseResponse> GetAllOrders(int pageIndex, int pageSize, string status, string name)
        {
            
            var queryable = dbContext.Orders
                .Include(o => o.User)
                .OrderByDescending(o => o.Id)
                .AsQueryable();

            var totalItems = queryable.Count();


            if (status != null && status != "Tất cả")
            {
                queryable = queryable.Where(o => o.OrderStatus.Equals(status));
            }

            if(!string.IsNullOrEmpty(name))
            {
                 queryable = queryable.Where(o => o.User.FullName.ToLower().Contains(name.ToLower()));
            }

            var orders = await queryable
                .Include(o => o.AddressOrder)
                .Include(o => o.Payment)
                .Include(o => o.OrderItems)
                    .ThenInclude(o => o.ProductVariant)
                        .ThenInclude(o => o.Product)
                .Skip((pageIndex - 1) * pageSize)
                .Take(pageSize).ToListAsync();

            var response = new PaginationResponse<List<OrderResource>>()
            {
                Data = orders.Select(order => applicationMapper.MapToOrderResource(order)).ToList(),
                Message = "Lấy danh sách đơn hàng thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true,
                Pagination = new Pagination
                {
                    TotalItems = totalItems,
                    TotalPages = (int)Math.Ceiling((double)totalItems / pageSize),
                }
            };

            return response;
        }

        public async Task<BaseResponse> GetOrderById(int id)
        {
            Order? order = await dbContext.Orders
                .Include(o => o.AddressOrder)
                .Include(o => o.OrderHistories)
                .Include(o => o.Payment)
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                    .ThenInclude(o => o.ProductVariant)
                        .ThenInclude(o => o.Product)
                .Include(o => o.OrderItems)
                    .ThenInclude(o => o.ProductVariant)
                        .ThenInclude(o => o.Size)
                .Include(o => o.OrderItems)
                    .ThenInclude(o => o.ProductVariant)
                        .ThenInclude(o => o.Color)
                .SingleOrDefaultAsync(o => o.Id == id)
                    ?? throw new NotFoundException("Không tìm thấy đơn hàng nào");


            var response = new DataResponse<OrderResource>();
            response.Message = "Lấy thông tin đơn hàng thành công";
            response.StatusCode = System.Net.HttpStatusCode.OK;
            response.Success = true;
            response.Data = applicationMapper.MapToOrderResource(order);

            return response;
        }

        public async Task UpdateStatusOrderToConfirmed(int id)
        {
            Order? order = await dbContext.Orders
                .Include(o => o.OrderHistories)
                .SingleOrDefaultAsync(o => o.Id == id)
                    ?? throw new NotFoundException("Không tìm thấy đơn hàng nào");

            if (order.OrderStatus.Equals(OrderStatus.PENDING))
            {
                order.OrderStatus = OrderStatus.CONFIRMED;
                order.OrderHistories.Add(new OrderHistory
                {
                    OrderStatus = OrderStatus.CONFIRMED,
                    ModifyAt = DateTime.Now,
                    Note = "Đơn hàng đã được tiếp nhận và đang trong quá trình xử lí",
                });
                await dbContext.SaveChangesAsync();
                await fcmService.SendNotification("Thông báo mới", $"Đơn hàng {order.Id} của bạn đã được tiếp nhận", order.UserId, order.Id, NotificationType.ORDER);
            }
            else throw new Exception("Cập nhật đơn hàng thất bại");

            
        }

        public async Task UpdateStatusOrderToRejected(int id)
        {
            Order? order = await dbContext.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(o => o.ProductVariant)
                .Include(o => o.OrderHistories)
                .SingleOrDefaultAsync(o => o.Id == id)
                    ?? throw new NotFoundException("Không tìm thấy đơn hàng nào");

            if (order.OrderStatus.Equals(OrderStatus.PENDING) || order.OrderStatus.Equals(OrderStatus.WAITING_PAYMENT))
            {
                order.OrderStatus = OrderStatus.REJECTED;
                order.OrderHistories.Add(new OrderHistory
                {
                    OrderStatus = OrderStatus.REJECTED,
                    ModifyAt = DateTime.Now,
                    Note = "Shop đã từ chối đơn hàng của bạn",
                });

                foreach(var item in order.OrderItems)
                {
                    item.ProductVariant.InStock += item.Quantity;
                }

                await dbContext.SaveChangesAsync();
                await fcmService.SendNotification("Thông báo mới", $"Đơn hàng {order.Id} của bạn đã bị từ chối", order.UserId, order.Id, NotificationType.ORDER);
            }
            else throw new Exception("Cập nhật đơn hàng thất bại");
        }

        public async Task UpdateStatusOrderToDelivering(int id)
        {
            Order? order = await dbContext.Orders
                .Include(o => o.OrderHistories)
                .SingleOrDefaultAsync(o => o.Id == id)
                    ?? throw new NotFoundException("Không tìm thấy đơn hàng nào");

            if (order.OrderStatus.Equals(OrderStatus.CONFIRMED))
            {
                order.OrderStatus = OrderStatus.DELIVERING;
                order.OrderHistories.Add(new OrderHistory
                {
                    OrderStatus = OrderStatus.DELIVERING,
                    ModifyAt = DateTime.Now,
                    Note = "Đơn hàng đang được vận chuyển tới địa chỉ của bạn",
                });
                await dbContext.SaveChangesAsync();
                await fcmService.SendNotification("Thông báo mới", $"Đơn hàng {order.Id} của bạn đã bắt đầu vận chuyển", order.UserId, order.Id, NotificationType.ORDER);
            }
            else throw new Exception("Cập nhật đơn hàng thất bại");
        }

        public async Task UpdateStatusOrderToDelivered(int id)
        {
            Order? order = await dbContext.Orders
                .Include(o => o.OrderHistories)
                .Include(o => o.Payment)
                .SingleOrDefaultAsync(o => o.Id == id)
                    ?? throw new NotFoundException("Không tìm thấy đơn hàng nào");
           
            if (order.OrderStatus.Equals(OrderStatus.DELIVERING))
            {
                order.OrderStatus = OrderStatus.DELIVERED;
                order.Payment.Status = true;
                order.Payment.PaymentDate = DateTime.Now;
                order.OrderHistories.Add(new OrderHistory
                {
                    OrderStatus = OrderStatus.DELIVERED,
                    ModifyAt = DateTime.Now,
                    Note = "Đơn hàng đã được giao tới địa chỉ của bạn",
                });
                await dbContext.SaveChangesAsync();
                await fcmService.SendNotification("Thông báo mới", $"Đơn hàng {order.Id} của bạn đã được giao thành công", order.UserId, order.Id, NotificationType.ORDER);
            }
            else throw new Exception("Cập nhật đơn hàng thất bại");
        }
    }
}
