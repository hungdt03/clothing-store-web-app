using back_end.Core.Models;
using back_end.Core.Requests;
using back_end.Data;
using back_end.Extensions;
using back_end.Mappers;
using back_end.Services.Interfaces;
using FirebaseAdmin.Messaging;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace back_end.Infrastructures.FCM
{
    public class FcmService : IFcmService
    {
        private readonly MyStoreDbContext dbContext;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly FirebaseMessaging _messaging;
        private readonly INotificationService notificationService;
        private readonly ApplicationMapper applicationMapper;


        public FcmService(MyStoreDbContext dbContext, IHttpContextAccessor httpContextAccessor, FirebaseMessaging firebaseMessaging, INotificationService notificationService, ApplicationMapper applicationMapper)
        {
            this.dbContext = dbContext;
            this.httpContextAccessor = httpContextAccessor;
            _messaging = firebaseMessaging;
            this.notificationService = notificationService;
            this.applicationMapper = applicationMapper;
        }

        public async Task<List<string>> GetAllDeviceTokensByUserId(string userId)
        {
            var tokens = await dbContext.DeviceTokens
                .Where(x => x.UserId == userId)
                .Select(x => x.Token)
                .ToListAsync();

            return tokens;
        }

        public async Task SaveTokenDevice(DeviceTokenRequest request)
        {
            var userId = httpContextAccessor.HttpContext.User.GetUserId();
            var existToken = await dbContext.DeviceTokens
                .Where(token => token.Token == request.DeviceToken && token.UserId != userId) 
                .OrderByDescending(token => token.Timestamp)
                .ToListAsync();

            if(existToken != null)
            {
                dbContext.DeviceTokens.RemoveRange(existToken);
            }

            var isUserIncludeToken = dbContext
                .DeviceTokens.Any(u => u.Token == request.DeviceToken && u.UserId == userId);

            if(!isUserIncludeToken)
            {
                var newTokenDevice = new DeviceToken()
                {
                    Timestamp = DateTime.Now,
                    UserId = userId,
                    Token = request.DeviceToken,
                };

                await dbContext.DeviceTokens.AddAsync(newTokenDevice);
            }

            
            await dbContext.SaveChangesAsync();
        }

        public async Task SendNotification(string title, string content, string recipientId, int referenceId, string notificationType, string toRole = "ADMIN")
        {
            try
            {
                var tokens = await dbContext.DeviceTokens
                .Where(x => x.UserId == recipientId)
                .Select(x => x.Token)
                .ToListAsync();

                if(tokens.Count > 0)
                {
                    Core.Models.Notification notification = new Core.Models.Notification()
                    {
                        CreatedAt = DateTime.Now,
                        Description = content,
                        Title = title,
                        HaveRead = false,
                        NotificationType = notificationType,
                        RecipientId = recipientId,
                        ReferenceId = referenceId
                    };

                    var savedNotification = await notificationService.CreateNotification(notification);
                    var resource = applicationMapper.MapToNotificationResource(savedNotification);
                    var recipientJson = JsonConvert.SerializeObject(resource.Recipient);

                    var message = new FirebaseAdmin.Messaging.MulticastMessage()
                    {
                        Tokens = tokens,
                        Data = new Dictionary<string, string>()
                        {
                            { "id", resource.Id.ToString() }, 
                            { "title", resource.Title },
                            { "content", resource.Content },
                            { "referenceId", resource.ReferenceId?.ToString() },
                            { "recipient", recipientJson }, 
                            { "createdAt", savedNotification.CreatedAt.ToString("O") }, 
                            { "haveRead", savedNotification.HaveRead.ToString() },     
                            { "notificationType", savedNotification.NotificationType }
                        }
                    };

                    var response = await _messaging.SendEachForMulticastAsync(message);

                    if (response.FailureCount > 0)
                    {
                        var failedTokens = new List<string>();
                        for (int i = 0; i < response.Responses.Count; i++)
                        {
                            if (!response.Responses[i].IsSuccess)
                            {
                                failedTokens.Add(tokens[i]);
                            }
                        }

                        throw new Exception($"Có {response.FailureCount} lỗi xảy ra khi gửi thông báo tới các tokens: {string.Join(", ", failedTokens)}");
                    }
                }

            }
            catch (FirebaseMessagingException ex)
            {
                throw new Exception($"Lỗi firebase: {ex.Message}");
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
