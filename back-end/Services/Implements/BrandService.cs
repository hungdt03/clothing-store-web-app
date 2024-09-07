using back_end.Core.Models;
using back_end.Core.Requests;
using back_end.Core.Responses;
using back_end.Core.Responses.Resources;
using back_end.Data;
using back_end.Mappers;
using back_end.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace back_end.Services.Implements
{
    public class BrandService : IBrandService
    {
        private readonly MyStoreDbContext dbContext;
        private readonly ApplicationMapper applicationMapper;

        public BrandService(MyStoreDbContext dbContext, ApplicationMapper applicationMapper)
        {
            this.dbContext = dbContext;
            this.applicationMapper = applicationMapper;
        }

        public async Task<BaseResponse> CreateBrand(BrandRequest request)
        {
            Brand brand = new Brand();
            brand.Name = request.Name;
            brand.Description = request.Description;

            await dbContext.Brands.AddAsync(brand);
            await dbContext.SaveChangesAsync();

            var response = new DataResponse<BrandResource>();
            response.Message = "Thêm thương hiệu mới thành công";
            response.Success = true;
            response.StatusCode = HttpStatusCode.Created;
            response.Data = applicationMapper.MapToBrandResource(brand);

            return response;
        }

        public async Task<BaseResponse> GetAllBrands(int pageIndex, int pageSize, string searchString)
        {
            var lowerString = searchString?.ToLower() ?? "";
            var queryable = dbContext.Brands
                .Where(br => br.IsDeleted == false && br.Name.ToLower().Contains(lowerString));

            List<Brand> brands = await queryable
                .Skip((pageIndex - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var response = new PaginationResponse<List<BrandResource>>();
            response.Success = true;
            response.StatusCode = HttpStatusCode.OK;
            response.Message = "Lấy thông tin thương hiệu thành công";
            response.Data = brands.Select(br => applicationMapper.MapToBrandResource(br)).ToList();
            response.Pagination = new Pagination
            {
                TotalItems = queryable.Count(),
                TotalPages = (int)Math.Ceiling((double)queryable.Count() / pageSize),
            };
            return response;
        }

        public async Task<BaseResponse> GetBrandById(int id)
        {
            Brand? brand = await dbContext.Brands
                .SingleOrDefaultAsync(br => br.Id == id && br.IsDeleted == false)
                    ?? throw new DirectoryNotFoundException("Không tìm thấy thương hiệu");

            var response = new DataResponse<BrandResource>();
            response.Success = true;
            response.StatusCode = HttpStatusCode.OK;
            response.Message = "Lấy thông tin thương hiệu thành công";
            response.Data = applicationMapper.MapToBrandResource(brand);

            return response;
        }

        public async Task RemoveBrand(int id)
        {
            Brand? brand = await dbContext.Brands
                .Include(b => b.Products)
                .SingleOrDefaultAsync(br => br.Id == id && br.IsDeleted == false)
                    ?? throw new DirectoryNotFoundException("Không tìm thấy thương hiệu");

            if(brand.Products != null && brand.Products.Any())
            {
                brand.IsDeleted = true;
            } else
            {
                dbContext.Brands.Remove(brand);
            }

            int rows = await dbContext.SaveChangesAsync();
            if (rows == 0) throw new Exception("Xóa danh mục thất bại");
        }

        public async Task<BaseResponse> UpdateBrand(int id, BrandRequest request)
        {
            Brand? brand = await dbContext.Brands
                .SingleOrDefaultAsync(br => br.Id == id && br.IsDeleted == false)
                    ?? throw new DirectoryNotFoundException("Không tìm thấy thương hiệu");
            
            brand.Name = request.Name;
            brand.Description = request.Description;

            await dbContext.SaveChangesAsync();

            var response = new DataResponse<BrandResource>();
            response.Success = true;
            response.StatusCode = HttpStatusCode.NoContent;
            response.Message = "Cập nhật thông tin thương hiệu thành công";
            response.Data = applicationMapper.MapToBrandResource(brand);

            return response;

        }
    }
}
