using back_end.Core.DTOs;
using back_end.Core.Models;
using back_end.Core.Responses;

namespace back_end.Services.Interfaces
{
    public interface INotificationService
    {
        Task<Notification> CreateNotification(Notification notification);
        Task<BaseResponse> GetAllNotifications();
    }
}
