using back_end.Core.Models;
using back_end.Core.Requests;
using back_end.Core.Responses;
using back_end.Core.Responses.Resources;
using back_end.Data;
using back_end.Exceptions;
using back_end.Mappers;
using back_end.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace back_end.Services.Implements
{
    public class AddressOrderService : IAddressOrderService
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly MyStoreDbContext dbContext;
        private readonly ApplicationMapper _applicationMapper;

        public AddressOrderService(IHttpContextAccessor contextAccessor, MyStoreDbContext dbContext, ApplicationMapper applicationMapper)
        {
            _contextAccessor = contextAccessor;
            this.dbContext = dbContext;
            this._applicationMapper = applicationMapper;
        }

        private async Task setDefaultToFalse()
        {
            AddressOrder? defaultAddress = await dbContext.AddressOrders.
                SingleOrDefaultAsync(d => d.IsDefault);

            if (defaultAddress == null) return;
            defaultAddress.IsDefault = false;
        }

        public async Task<BaseResponse> CreateAddressOrder(AddressOrderRequest request)
        {
            if (request.IsDefault)
                await setDefaultToFalse();

            AddressOrder addressOrder = new AddressOrder();
            addressOrder.Address = request.Address;
            addressOrder.PhoneNumber = request.PhoneNumber;
            addressOrder.FullName = request.FullName;
            addressOrder.Email = request.Email;
            addressOrder.IsDefault = request.IsDefault;
            addressOrder.UserId = _contextAccessor.HttpContext.User.FindFirst(ClaimTypes.Sid).Value;

            var savedAddressOrder = await dbContext.AddressOrders.AddAsync(addressOrder);
            await dbContext.SaveChangesAsync();

            var response = new DataResponse<AddressOrderResource>();
            response.Message = "Thêm địa chỉ mới thành công";
            response.Success = true;
            response.StatusCode = System.Net.HttpStatusCode.Created;
            response.Data = _applicationMapper.MapToAddressOrderResource(savedAddressOrder.Entity);

            return response;
        }

        public async Task<BaseResponse> GetAllByUsers()
        {
            var user = _contextAccessor.HttpContext?.User;
            string userId = _contextAccessor.HttpContext.User.FindFirst(ClaimTypes.Sid).Value;
            List<AddressOrder> addressOrders = await dbContext.AddressOrders
                .Where(a => a.UserId == userId).ToListAsync();

            var response = new DataResponse<List<AddressOrderResource>>();
            response.Message = "Lấy danh sách địa chỉ thành công";
            response.Success = true;
            response.StatusCode = System.Net.HttpStatusCode.Created;
            response.Data = addressOrders.Select(addressOrder => _applicationMapper.MapToAddressOrderResource(addressOrder)).ToList();

            return response;

        }

        public async Task<BaseResponse> SetCheckedDefault(int id)
        {
            await setDefaultToFalse();
            AddressOrder? addressOrder = await dbContext.AddressOrders
                .SingleOrDefaultAsync(a => a.Id == id)
                    ?? throw new NotFoundException("Địa chỉ không tồn tại");

            addressOrder.IsDefault = true;
            await dbContext.SaveChangesAsync();

            var response = new BaseResponse();
            response.Message = "Cập nhật trạng thái địa chỉ thành công";
            response.Success = true;
            response.StatusCode = System.Net.HttpStatusCode.NoContent;

            return response;
        }
    }
}
