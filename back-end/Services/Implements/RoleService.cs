using back_end.Core.Models;
using back_end.Core.Responses;
using back_end.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace back_end.Services.Implements
{
    public class RoleService : IRoleService
    {
        private readonly RoleManager<IdentityRole> roleManager;

        public RoleService(RoleManager<IdentityRole> roleManager)
        {
            this.roleManager = roleManager;
        }

        public async Task<BaseResponse> GetAllRoles()
        {
            var roles = await roleManager.Roles.ToListAsync();
            return new DataResponse<List<IdentityRole>>
            {
                Data = roles,
                Message = "Lấy roles thành công",
                Success = true,
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }
    }
}
