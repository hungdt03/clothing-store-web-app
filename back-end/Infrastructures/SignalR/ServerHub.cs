using back_end.Core.DTOs;
using back_end.Core.Models;
using back_end.Core.Requests;
using back_end.Core.Responses.Resources;
using back_end.Extensions;
using back_end.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;

namespace back_end.Infrastructures.SignalR
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ServerHub : Hub
    {
        private readonly IMessageService messageService;
        private readonly PresenceTracker presenceTracker;
        private readonly UserManager<User> _userManager;
        private readonly IAccountService _accountService;

        public ServerHub(UserManager<User> userManager, IMessageService messageService, PresenceTracker presenceTracker, IAccountService accountService)
        {
            this.messageService = messageService;
            _userManager = userManager;
            this.presenceTracker = presenceTracker;
            _accountService = accountService;
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.User.GetUserId();
            User user = await _userManager.FindByIdAsync(userId);
            await _accountService.UpdateUserStatus(user, true);
            await presenceTracker.UserConnected(user.UserName, Context.ConnectionId);

            await base.OnConnectedAsync();
        }

        public async Task SendMessage(MessageRequest messageRequest)
        {
            var currentUser = Context.User.GetUserId();

            if (currentUser == messageRequest.RecipientId)
            {
                throw new Exception("Không thể gửi tin nhắn cho chính mình");
            }

            User senderUser = await _userManager.FindByIdAsync(currentUser);
            User recipientUser = await _userManager.FindByIdAsync(messageRequest.RecipientId);

            if (recipientUser == null)
                throw new Exception("Người nhận không tồn tại");

            var groupName = GetGroupName(senderUser.UserName, recipientUser.UserName);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            var recipientConnections = await presenceTracker.GetConnectionsForUser(recipientUser.UserName);
            if (recipientConnections != null && recipientConnections.Any())
            {
                foreach (var connectionId in recipientConnections)
                {
                    await Groups.AddToGroupAsync(connectionId, groupName);
                }
            }

            MessageDTO messageDTO = new MessageDTO
            {
                SenderId = senderUser.Id,
                RecipientId = recipientUser.Id,
                Content = messageRequest.Content,
                Images = messageRequest.Images,
                GroupName = groupName,

            };

            MessageResource messageResource = await messageService.CreateNewMessage(messageDTO);

            await Clients.Group(groupName).SendAsync("NewMessage", messageResource);

        }


        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.User.GetUserId();
            User user = await _userManager.FindByIdAsync(userId);
            await _accountService.UpdateUserStatus(user, false);
            await presenceTracker.UserDisconnected(user.UserName, Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }

        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
        }

        private string GetGroupName(string caller, string other)
        {
            var stringCompare = string.CompareOrdinal(caller, other) < 0;
            return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
        }


    }
}
