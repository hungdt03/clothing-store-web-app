using back_end.Core.DTOs;
using back_end.Core.Models;
using back_end.Core.Responses;
using back_end.Core.Responses.Resources;
using back_end.Data;
using back_end.Extensions;
using back_end.Mappers;
using back_end.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace back_end.Services.Implements
{
    public class NotificationService : INotificationService
    {
        private readonly MyStoreDbContext dbContext;
        private readonly ApplicationMapper applicationMapper;
        private readonly IHttpContextAccessor httpContextAccessor;

        public NotificationService(MyStoreDbContext dbContext, ApplicationMapper applicationMapper, IHttpContextAccessor httpContextAccessor) { 
            this.dbContext = dbContext;
            this.applicationMapper = applicationMapper;
            this.httpContextAccessor = httpContextAccessor;
        }
        public async Task<Notification> CreateNotification(Notification notification)
        {
            var savedNotification = await dbContext.AddAsync(notification);
            int rows = await dbContext.SaveChangesAsync();
            if (rows == 0) throw new Exception("Thất bại khi tạo thông báo");
            await dbContext.Entry(savedNotification.Entity).Reference(n => n.Recipient).LoadAsync();
            return savedNotification.Entity;
        }

        public async Task<BaseResponse> GetAllNotifications()
        {
            var userId = httpContextAccessor.HttpContext.User.GetUserId();
            var notifications = await dbContext.Notifications
                .Include(n => n.Recipient)
                .Where(n => n.RecipientId.Equals(userId))
                .OrderByDescending(o => o.CreatedAt)
                .Select(n => applicationMapper.MapToNotificationResource(n)).ToListAsync();

            return new DataResponse<List<NotificationResource>>
            {
                Data = notifications,
                Message = "Lấy thông báo thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };
        }
    }
}
