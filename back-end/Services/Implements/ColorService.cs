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
    public class ColorService : IColorService
    {
        private readonly MyStoreDbContext dbContext;
        private readonly ApplicationMapper applicationMapper;

        public ColorService(ApplicationMapper applicationMapper, MyStoreDbContext dbContext)
        {
            this.applicationMapper = applicationMapper;
            this.dbContext = dbContext;
        }

     
        public async Task<BaseResponse> CreateColor(ColorRequest request)
        {
            Color color = new Color();
            color.HexCode = request.HexCode;
            color.Name = request.Name;

            var savedColor = await dbContext.Colors.AddAsync(color);
            await dbContext.SaveChangesAsync();

            var response = new DataResponse<ColorResource>();
            response.StatusCode = System.Net.HttpStatusCode.Created;
            response.Message = "Thêm màu sắc thành công";
            response.Success = true;
            response.Data = applicationMapper.MapToColorResource(savedColor.Entity);
            return response;
        }

        public async Task<BaseResponse> GetAllColors()
        {
            List<Color> colors = await dbContext.Colors
                .Where(c => !c.IsDeleted)
                .ToListAsync();

            var response = new DataResponse<List<ColorResource>>();
            response.StatusCode = System.Net.HttpStatusCode.OK;
            response.Message = "Lấy danh sách màu sắc thành công";
            response.Success = true;
            response.Data = colors.Select(color => applicationMapper.MapToColorResource(color)).ToList();
            return response;
        }

        public async Task RemoveColor(int id)
        {
            Color? color = await dbContext.Colors
                .Include(c => c.ProductVariants)
                .SingleOrDefaultAsync(c => c.Id == id && !c.IsDeleted)
                    ?? throw new NotFoundException("Không tìm thấy màu sắc");

            if(color.ProductVariants != null && color.ProductVariants.Any())
            {
                color.IsDeleted = true;
            } else
            {
                dbContext.Colors.Remove(color);
            }

            int rows = await dbContext.SaveChangesAsync();
            if (rows == 0) throw new Exception("Xóa màu sắc thất bại");
        }

        public async Task<BaseResponse> UpdateColor(int id, ColorRequest request)
        {
            Color? color = await dbContext.Colors
                .SingleOrDefaultAsync(c => c.Id == id && c.IsDeleted == false)
                    ?? throw new NotFoundException("Không tìm thấy màu sắc");

            color.Name = request.Name;
            color.HexCode = request.HexCode;

            await dbContext.SaveChangesAsync();

            var response = new DataResponse<ColorResource>();
            response.StatusCode = System.Net.HttpStatusCode.NoContent;
            response.Message = "Cập nhật màu sắc thành công";
            response.Success = true;
            response.Data = applicationMapper.MapToColorResource(color);
            return response;
        }
    }
}
