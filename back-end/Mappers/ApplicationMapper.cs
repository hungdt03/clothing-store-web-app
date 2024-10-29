using back_end.Core.Constants;
using back_end.Core.Models;
using back_end.Core.Responses.Report;
using back_end.Core.Responses.Resources;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace back_end.Mappers
{
    public class ApplicationMapper
    {
        private readonly UserManager<User> _userManager;
        private readonly IHttpContextAccessor _contextAccessor;

        public ApplicationMapper(UserManager<User> userManager, IHttpContextAccessor contextAccessor)
        {
            _userManager = userManager;
            _contextAccessor = contextAccessor;
        }
        public CategoryResource MapToCategoryResource(Category category)
        {
            return new CategoryResource()
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                ParentCategory = category.ParentCategory != null ? MapToCategoryResource(category.ParentCategory) : null
            };
        }

        public ReviewShowResource MapToReviewShowResource(ReviewShow reviewShow)
        {
            return new ReviewShowResource()
            {
                Evaluation = MapToEvaluationResourceWithoutPrincipal(reviewShow.Evaluation),
                Id = reviewShow.Id,
            };
        }

        public CategoryLevelResource MapToCategoryLevelResource(Category category)
        {
            return new CategoryLevelResource()
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                CategoryChildren = category.CategoryChildren != null ? category.CategoryChildren.Select(c => MapToCategoryLevelResource(c)).ToList() : null
            };
        }

        public ProductResource MapToProductResource(Product product)
        {
            return new ProductResource()
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                OldPrice = product.OldPrice,
                Quantity = product?.ProductVariants != null ? product.ProductVariants.Count : 0,
                Price = product.Price,
                PurchasePrice = product.PurchasePrice,
                ZoomImage = product.ZoomImage,
                Thumbnail = product.Thumbnail,
                Images = product.Images != null ? product.Images.Select(MapToProductImageResource).ToList() : null,
                Category = product.Category != null ? MapToCategoryResource(product.Category) : null,
                Brand = product.Brand != null ? MapToBrandResource(product.Brand) : null
            };
        }

        public ProductReport MapToProductReport(Product product, int quantity)
        {
            return new ProductReport
            {
                Product = MapToProductResource(product),
                Quantity = quantity
            };
        }

        public VariantResource MapToVariantResource(ProductVariant variant)
        {
            return new VariantResource()
            {
                Id = variant.Id,
                InStock = variant.InStock,
                ThumbnailUrl = variant.ThumbnailUrl,
                Color = variant.Color != null ? MapToColorResource(variant.Color) : null,
                Size = variant.Size != null ? MapToSizeResource(variant.Size) : null,
                Product = variant.Product != null ? MapToProductResource(variant.Product) : null,
                Images = variant.Images != null ? variant.Images.Select(MapToProductImageVariantResource).ToList() : null
            };
        }

        public BrandResource MapToBrandResource(Brand brand) {
            return new BrandResource()
            {
                Id = brand.Id,
                Name = brand.Name,
                Description = brand.Description,
            };
        }

        public BlogResource MapToBlogResource(Blog blog)
        {
            return new BlogResource()
            {
                Id = blog.Id,
                Title = blog.Title,
                TextPlain = blog.TextPlain,
                IsHidden = blog.IsHidden,
                Content = blog.Content,
                CreatedDate = blog.CreatedDate,
                Thumbnail = blog.Thumbnail,
                User = blog.User != null ? MapToUserResourceWithoutRoles(blog.User) : null,
            };
        }

        public async Task<UserResource> MapToUserResource(User user)
        {
            IList<string> roles = await _userManager.GetRolesAsync(user);
            return new UserResource()
            {
                Id = user.Id,
                Name = user.FullName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Username = user.UserName,
                Avatar = user.Avatar,
                CoverImage = user.CoverImage,
                Roles = roles.ToList(),
                IsOnline = user.IsOnline,
                IsLocked = user.IsLocked,
                RecentOnlineTime = user.RecentOnlineTime,
            };
        }

        public async Task<UserContactResource> MapToUserContactResource(User user)
        {
            return new UserContactResource()
            {
                User = await MapToUserResource(user),
            };
        }


        public UserResource MapToUserResourceWithoutRoles(User user)
        {
            return new UserResource()
            {
                Id = user.Id,
                Name = user.FullName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Username = user.UserName,
                Avatar = user.Avatar,
                CoverImage = user.CoverImage,
                IsLocked = user.IsLocked,
                IsOnline = user.IsOnline,
                RecentOnlineTime = user.RecentOnlineTime,
            };
        }

        public ProductImageResource MapToProductImageResource(ProductImage image)
        {
            return new ProductImageResource()
            {
                Id = image.Id,
                Url = image.Url,
            };
        }

        public ProductImageResource MapToProductImageVariantResource(ProductVariantImage image)
        {
            return new ProductImageResource()
            {
                Id = image.Id,
                Url = image.Url,
            };
        }

        public ColorResource MapToColorResource(Color color) { return new ColorResource() { Id = color.Id, Name = color.Name, HexCode = color.HexCode }; }

        public SizeResource MapToSizeResource(Size size)
        {
            return new SizeResource()
            {
                Id = size.Id,
                ESize = size.ESize,
                MaxHeight = size.MaxHeight,
                MinHeight = size.MinHeight,
                MaxWeight = size.MaxWeight,
                MinWeight = size.MinWeight,
            };
        }

        public List<OrderProcessItem> GetOrderProcess(List<OrderHistory> histories)
        {

            var result = new List<OrderProcessItem>();

            void AddOrderProcessItem(string status)
            {
                if (!result.Any(item => item.OrderStatus.Equals(status)))
                {
                    result.Add(new OrderProcessItem
                    {
                        OrderStatus = status,
                        IsCompleted = false
                    });
                }
            }

            foreach (var hist in histories)
            {
                result.Add(new OrderProcessItem
                {
                    OrderStatus = hist.OrderStatus,
                    ModifyAt = hist.ModifyAt,
                    Note = hist.Note,
                    IsCompleted = true,
                });
            }

            var requiredSteps = new List<string>
            {
                OrderStatus.CONFIRMED,
                OrderStatus.DELIVERING,
                OrderStatus.DELIVERED,
                OrderStatus.COMPLETED
            };

            requiredSteps = requiredSteps.SkipWhile(status => result.Any(item => item.OrderStatus.Equals(status))).ToList();

            foreach (var status in requiredSteps)
            {
                AddOrderProcessItem(status);
            }

            return result;
        }

        public OrderResource MapToOrderResource(Order order)
        {
            var orderItems = order.OrderItems.ToList();
            var thumbnailUrl = orderItems[0].ProductVariant.ThumbnailUrl;

            var title = orderItems.Count switch
            {
                0 => string.Empty,
                1 => orderItems[0].ProductVariant?.Product?.Name,
                2 => $"{orderItems[0].ProductVariant?.Product?.Name} | {orderItems[1].ProductVariant?.Product?.Name}",
                _ => $"{orderItems[0].ProductVariant?.Product?.Name} | {orderItems[1].ProductVariant?.Product?.Name} và {orderItems.Count - 2} sản phẩm khác"
            };

            return new OrderResource()
            {
                Id = order.Id,
                CreatedAt = order.CreatedAt,
                Note = order.OrderNote,
                TotalPrice = order.TotalPrice,
                Title = title,
                OrderStatus = order.OrderStatus,
                ThumbnailUrl = thumbnailUrl,
                Quantity = order.Quantity,
                OrderSteps = order.OrderHistories != null ? GetOrderProcess(order.OrderHistories) : new List<OrderProcessItem>(),
                Items = order.OrderItems != null ? order.OrderItems.Select(MapToOrderItemResource).ToList() : new List<OrderItemResource>(),
                Payment = order.Payment != null ? MapToPaymentResource(order.Payment) : null,
                AddressOrder = order.AddressOrder != null ? MapToAddressOrderResource(order.AddressOrder) : null,
                User = order.User != null ? MapToUserResourceWithoutRoles(order.User) : null
            };
        }

        public MessageResource MapToMessageResource(Message message)
        {
            return new MessageResource()
            {
                Id = message.Id,
                Content = message.Content,
                SentAt = message.SendAt,
                Sender = message.Sender != null ? MapToUserResourceWithoutRoles(message.Sender) : null,
                Recipient = message.Recipient != null ? MapToUserResourceWithoutRoles(message.Recipient) : null,
                Images = message.Images != null ? message.Images.Select(m => m.Url).ToList() : new List<string>(),
            };
        }

        public OrderHistoryResource MapToOrderHistoryResource(OrderHistory orderHistory)
        {
            return new OrderHistoryResource()
            {
                Id = orderHistory.Id,
                ModifyAt = orderHistory.ModifyAt,
                OrderStatus = orderHistory.OrderStatus,
                Note = orderHistory.Note,
            };
        }

        public PaymentResource MapToPaymentResource(Payment payment)
        {
            return new PaymentResource()
            {
                CreatedDate = payment.CreatedDate,
                PaymentCode = payment.PaymentCode,
                PaymentMethod = payment.PaymentMethod,
                Status = payment.Status,
            };
        }

        public AddressOrderResource MapToAddressOrderResource(AddressOrder addressOrder)
        {
            return new AddressOrderResource()
            {
                Id = addressOrder.Id,
                Address = addressOrder.Address,
                Email = addressOrder.Email,
                FullName = addressOrder.FullName,
                IsDefault = addressOrder.IsDefault,
                PhoneNumber = addressOrder.PhoneNumber,
            };
        }

        public OrderItemResource MapToOrderItemResource(OrderItem item)
        {
            return new OrderItemResource()
            {
                Id = item?.Id,
                Price = item?.Price,
                SubTotal = item?.SubTotal,
                Quantity = item?.Quantity,
                ProductId = item?.ProductVariant?.ProductId,
                ProductName = item?.ProductVariant?.Product?.Name,
                ProductPrice = item?.ProductVariant?.Product?.Price,
                Variant = item?.ProductVariant != null ? MapToVariantResource(item.ProductVariant) : null,
                
            };
        }

        public EvaluationResource MapToEvaluationResource(Evaluation evaluation, string userId)
        {
            return new EvaluationResource()
            {
                Id = evaluation.Id,
                Content = evaluation.Content,
                CreatedAt = evaluation.DateCreated,
                Stars = evaluation.Stars,
                Favorites = evaluation.Favorites != null ? evaluation.Favorites.Count : 0,
                IsFavoriteIncludeMe = evaluation.Favorites != null ? evaluation.Favorites.Any(e => e.Id.Equals(userId)) : false,
                User = evaluation.User != null ? MapToUserResourceWithoutRoles(evaluation.User) : null
            };
        }

        public EvaluationResource MapToEvaluationResourceWithoutPrincipal(Evaluation evaluation)
        {
            return new EvaluationResource()
            {
                Id = evaluation.Id,
                Content = evaluation.Content,
                CreatedAt = evaluation.DateCreated,
                Stars = evaluation.Stars,
                Favorites = evaluation.Favorites != null ? evaluation.Favorites.Count : 0,
                IsFavoriteIncludeMe = false,
                User = evaluation.User != null ? MapToUserResourceWithoutRoles(evaluation.User) : null
            };
        }

        public NotificationResource MapToNotificationResource(Notification notification) {
            return new NotificationResource()
            {
                Id = notification.Id,
                Title = notification.Title,
                Content = notification.Description,
                CreatedAt = notification.CreatedAt,
                Recipient = MapToUserResourceWithoutRoles(notification.Recipient),
                HaveRead = notification.HaveRead,
                ReferenceId = notification.ReferenceId,
                NotificationType = notification.NotificationType,
            };
        }
    }
}
