using back_end.Core.Requests;

namespace back_end.Infrastructures.FCM
{
    public interface IFcmService
    {
        Task SaveTokenDevice(DeviceTokenRequest request);
        Task<List<string>> GetAllDeviceTokensByUserId(string userId);
        Task SendNotification(string title, string content, string recipientId, int referenceId, string notificationType, string toRole = "ADMIN");
    }
}
