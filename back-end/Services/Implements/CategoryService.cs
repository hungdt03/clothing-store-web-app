using back_end.Core.Models;
using back_end.Core.Requests;
using back_end.Core.Responses;
using back_end.Core.Responses.Resources;
using back_end.Data;
using back_end.Exceptions;
using back_end.Mappers;
using back_end.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace back_end.Services.Implements
{
    public class CategoryService : ICategoryService
    {
        private readonly MyStoreDbContext dbContext;
        private readonly ApplicationMapper applicationMapper;

        public CategoryService(MyStoreDbContext dbContext, ApplicationMapper applicationMapper)
        {
            this.dbContext = dbContext;
            this.applicationMapper = applicationMapper;
        }


        public async Task<BaseResponse> CreateCategory(CategoryRequest request)
        {
            Category? checkParentCategory;
            var checkNotNull = request.ParentCategoryId != null && request.ParentCategoryId != 0;

            if (checkNotNull)
            {
                checkParentCategory = await dbContext.Categories
                .SingleOrDefaultAsync(cate => cate.Id == request.ParentCategoryId)
                    ?? throw new NotFoundException("Danh mục cha không tồn tại");
            }

            Category category = new Category();
            category.Name = request.Name;
            category.Description = request.Description;
            if(checkNotNull)
                category.ParentCategoryId = request.ParentCategoryId;

            var savedCategory = await dbContext.Categories.AddAsync(category);
            await dbContext.SaveChangesAsync();

            var response = new DataResponse<CategoryResource>();
            response.StatusCode = HttpStatusCode.Created;
            response.Message = "Thêm danh mục thành công";
            response.Success = true;
            response.Data = applicationMapper.MapToCategoryResource(savedCategory.Entity);

            return response;

        }

        public async Task<BaseResponse> GetAllCategories(int pageIndex, int pageSize, string searchString)
        {
            var lowerString = searchString.ToLower();
            var queryable = dbContext.Categories
                .Where(c => !c.IsDeleted && c.Name.ToLower().Contains(lowerString));

            List<Category> categories = await queryable
                .Skip((pageIndex - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            var response = new PaginationResponse<List<CategoryResource>>();
            response.StatusCode = HttpStatusCode.OK;
            response.Message = "Lấy thông tin danh mục thành công";
            response.Success = true;
            response.Data = categories.Select(category => applicationMapper.MapToCategoryResource(category)).ToList();
            response.Pagination = new Pagination()
            {
                TotalItems = queryable.Count(),
                TotalPages = (int)Math.Ceiling((double)queryable.Count() / pageSize)
            };

            return response;
        }

        public async Task<BaseResponse> GetAllCategoriesByLevel()
        {
            List<Category> categories = await dbContext.Categories
                .Include(c => c.CategoryChildren)
                .Where(c => c.ParentCategoryId == null && !c.IsDeleted)
                .ToListAsync();
            var response = new DataResponse<List<CategoryLevelResource>>();
            response.StatusCode = HttpStatusCode.OK;
            response.Message = "Lấy thông tin danh mục thành công";
            response.Success = true;
            response.Data = categories.Select(category => applicationMapper.MapToCategoryLevelResource(category)).ToList();

            return response;
        }

        public async Task<BaseResponse> GetCategoryById(int id)
        {
            Category? category = await dbContext.Categories
                .SingleOrDefaultAsync(ca => ca.Id == id && !ca.IsDeleted)
                    ?? throw new NotFoundException("Không tìm thấy danh mục");

            var response = new DataResponse<CategoryResource>();
            response.StatusCode = HttpStatusCode.OK;
            response.Message = "Lấy thông tin danh mục thành công";
            response.Success = true;
            response.Data = applicationMapper.MapToCategoryResource(category);

            return response;
        }

        public async Task RemoveCategory(int id)
        {
            Category? category = await dbContext.Categories
                .Include(c => c.Products)
                .Include(c => c.CategoryChildren)
                .SingleOrDefaultAsync(ca => ca.Id == id && !ca.IsDeleted)
                    ?? throw new NotFoundException("Không tìm thấy danh mục");

            if(category.Products != null && category.Products.Any())
            {
                category.IsDeleted = true;
            } else
            {
                if(category.CategoryChildren != null && category.CategoryChildren.Any())
                {
                    foreach(var child in category.CategoryChildren)
                    {
                        child.ParentCategory = null;
                    }
                }

                dbContext.Categories.Remove(category);
            }

            int rows = await dbContext.SaveChangesAsync();
            if (rows == 0) throw new Exception("Xóa danh mục thất bại");
        }

        public async Task<BaseResponse> UpdateCategory(int id, CategoryRequest request)
        {
            Category? category = await dbContext.Categories
                .SingleOrDefaultAsync(ca => ca.Id == id && !ca.IsDeleted)
                    ?? throw new NotFoundException("Không tìm thấy danh mục");

            Category? checkParentCategory;
            var checkNotNull = request.ParentCategoryId != null && request.ParentCategoryId != 0;

            if (checkNotNull)
            {
                checkParentCategory = await dbContext.Categories
                .SingleOrDefaultAsync(cate => cate.Id == request.ParentCategoryId)
                    ?? throw new NotFoundException("Danh mục cha không tồn tại");
            }

            category.Name = request.Name;
            category.Description = request.Description;

            if (checkNotNull)
                category.ParentCategoryId = request.ParentCategoryId;

            await dbContext.SaveChangesAsync();

            var response = new BaseResponse();
            response.StatusCode = HttpStatusCode.NoContent;
            response.Message = "Cập nhật danh mục thành công";
            response.Success = true;

            return response;
        }
    }
}
