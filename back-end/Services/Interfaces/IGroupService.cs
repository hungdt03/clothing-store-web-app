using back_end.Core.Models;

namespace back_end.Services.Interfaces
{
    public interface IGroupService
    {
        Task AddToGroup(Group group);
        Task<Group> FindGroupByGroupName(string groupName);
        Task<List<Group>> FindAllByUsername(string username);
        Task UpdateGroup(Group group);
    }
}
