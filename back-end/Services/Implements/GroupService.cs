using back_end.Core.Models;
using back_end.Services.Interfaces;

namespace back_end.Services.Implements
{
    public class GroupService : IGroupService
    {
        public Task AddToGroup(Group group)
        {
            throw new NotImplementedException();
        }

        public Task<List<Group>> FindAllByUsername(string username)
        {
            throw new NotImplementedException();
        }

        public Task<Group> FindGroupByGroupName(string groupName)
        {
            throw new NotImplementedException();
        }

        public Task UpdateGroup(Group group)
        {
            throw new NotImplementedException();
        }
    }
}
