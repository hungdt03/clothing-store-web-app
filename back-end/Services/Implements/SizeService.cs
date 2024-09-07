using back_end.Core.Models;
using back_end.Core.Requests;
using back_end.Core.Responses;
using back_end.Core.Responses.Resources;
using back_end.Data;
using back_end.Exceptions;
using back_end.Mappers;
using back_end.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace back_end.Services.Implements
{
    public class SizeService : ISizeService
    {
        private readonly MyStoreDbContext myStoreDbContext;
        private readonly ApplicationMapper applicationMapper;

        public SizeService(MyStoreDbContext myStoreDbContext, ApplicationMapper applicationMapper)
        {
            this.myStoreDbContext = myStoreDbContext;
            this.applicationMapper = applicationMapper;
        }

        public async Task<BaseResponse> CreateSize(SizeRequest request)
        {
            Size size = new Size();
            size.ESize = request.ESize;
            size.MinWeight = request.MinWeight;
            size.MaxWeight = request.MaxWeight;
            size.MinHeight = request.MinHeight;
            size.MaxHeight = request.MaxHeight;

            var savedSize = await myStoreDbContext.Sizes.AddAsync(size);
            await myStoreDbContext.SaveChangesAsync();

            var response = new DataResponse<SizeResource>();
            response.StatusCode = System.Net.HttpStatusCode.Created;
            response.Message = "Thêm kích cỡ thành công";
            response.Success = true;
            response.Data = applicationMapper.MapToSizeResource(savedSize.Entity);
            return response;
        }

        public async Task<BaseResponse> GetAllSizes()
        {
            List<Size> sizes = await myStoreDbContext.Sizes
                .Where(p => p.IsDeleted == false)
                .ToListAsync();

            var response = new DataResponse<List<SizeResource>>();
            response.StatusCode = System.Net.HttpStatusCode.OK;
            response.Message = "Lấy danh sách kích cỡ thành công";
            response.Success = true;
            response.Data = sizes.Select(size => applicationMapper.MapToSizeResource(size)).ToList();
            return response;
        }

        public async Task RemoveSize(int id)
        {
            Size? size = await myStoreDbContext.Sizes
               .Include(s => s.ProductVariants)
               .SingleOrDefaultAsync(c => c.Id == id && c.IsDeleted == false)
                   ?? throw new NotFoundException("Không tìm thấy kích cỡ");

            if(size.ProductVariants != null && size.ProductVariants.Any())
            {
                size.IsDeleted = true;
            } else
            {
                myStoreDbContext.Sizes.Remove(size);
            }

            int rows = await myStoreDbContext.SaveChangesAsync();
            if (rows == 0) throw new Exception("Xóa kích cỡ thất bại");
        }

        public async Task<BaseResponse> UpdateSize(int id, SizeRequest request)
        {
            Size? size = await myStoreDbContext.Sizes
               .SingleOrDefaultAsync(c => c.Id == id && !c.IsDeleted)
                   ?? throw new NotFoundException("Không tìm thấy kích cỡ");

            size.ESize = request.ESize;
            size.MinWeight = request.MinWeight;
            size.MaxWeight = request.MaxWeight;
            size.MinHeight = request.MinHeight;
            size.MaxHeight = request.MaxHeight;

            await myStoreDbContext.SaveChangesAsync();

            var response = new DataResponse<SizeResource>();
            response.StatusCode = System.Net.HttpStatusCode.NoContent;
            response.Message = "Cập nhật kích cỡ thành công";
            response.Success = true;
            response.Data = applicationMapper.MapToSizeResource(size);
            return response;
        }
    }
}
