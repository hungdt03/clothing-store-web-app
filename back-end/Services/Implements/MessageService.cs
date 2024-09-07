using back_end.Core.DTOs;
using back_end.Core.Models;
using back_end.Core.Responses;
using back_end.Core.Responses.Resources;
using back_end.Data;
using back_end.Infrastructures.Cloudinary;
using back_end.Mappers;
using back_end.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace back_end.Services.Implements
{
    public class MessageService : IMessageService
    {
        private readonly MyStoreDbContext dbContext;
        private readonly ApplicationMapper applicationMapper;
        private readonly IUploadService uploadService;
        private readonly IHttpContextAccessor httpContextAccessor;

        public MessageService(MyStoreDbContext dbContext, ApplicationMapper applicationMapper, IUploadService uploadService, IHttpContextAccessor httpContextAccessor) { 
            this.dbContext = dbContext;
            this.applicationMapper = applicationMapper;
            this.uploadService = uploadService;
            this.httpContextAccessor = httpContextAccessor;
        }

        public async Task<MessageResource> CreateNewMessage(MessageDTO messageDTO)
        {
            Message message = new Message();
            message.SenderId = messageDTO.SenderId;
            message.RecipientId = messageDTO.RecipientId;
            message.Content = messageDTO.Content;
            message.SendAt = DateTime.Now;
            message.HaveRead = false;
            message.Images = new List<MessageImage>();
            if(messageDTO.Images != null)
            {
                List<string> images = await uploadService.UploadMutlipleFilesAsync(messageDTO.Images);
                foreach (string image in images)
                {
                    MessageImage messageImage = new MessageImage();
                    messageImage.Url = image;
                    message.Images.Add(messageImage);
                }
            }

            Group? existedGroup = await dbContext.Groups
                .SingleOrDefaultAsync(g => g.GroupName.Equals(messageDTO.GroupName));

            if (existedGroup == null)
            {
                Group group = new Group()
                {
                    GroupName = messageDTO.GroupName,
                    Message = message,
                    TotalUnReadMessages = 1
                };

                await dbContext.Groups.AddAsync(group);
            } else
            {
                existedGroup.Message = message;
                existedGroup.TotalUnReadMessages += 1;
            }

            
            await dbContext.SaveChangesAsync();

            return applicationMapper.MapToMessageResource(message);
        }

        public async Task<BaseResponse> GetAllMessages(string recipientId)
        {
            var senderId = httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Sid);

            List<Message> messages = await dbContext.Messages
                .Include(msg => msg.Sender)
                .Include(msg => msg.Recipient)
                .Where(msg =>
                    msg.RecipientId.Equals(recipientId) && msg.SenderId.Equals(senderId)
                   || msg.RecipientId.Equals(senderId) && msg.SenderId.Equals(recipientId)
                 )
                .ToListAsync();

            var response = new DataResponse<List<MessageResource>>();
            response.Message = "Lấy danh sách tin nhắn thành công";
            response.StatusCode = System.Net.HttpStatusCode.OK;
            response.Success = true;
            response.Data = messages.Select(msg => applicationMapper.MapToMessageResource(msg)).ToList();
            return response;
        }
    }
}
