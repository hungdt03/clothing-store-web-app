using back_end.Core.Models;
using back_end.Core.Requests;
using back_end.Core.Responses;
using back_end.Core.Responses.Resources;
using back_end.Data;
using back_end.Exceptions;
using back_end.Infrastructures.Cloudinary;
using back_end.Mappers;
using back_end.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace back_end.Services.Implements
{
    public class VariantService : IVariantService
    {
        private readonly MyStoreDbContext dbContext;
        private readonly IUploadService uploadService;
        private readonly ApplicationMapper applicationMapper;

        public VariantService(MyStoreDbContext dbContext, IUploadService uploadService, ApplicationMapper applicationMapper)
        {
            this.dbContext = dbContext;
            this.uploadService = uploadService;
            this.applicationMapper = applicationMapper;
        }

        public async Task<BaseResponse> CreateVariant(VariantRequest request)
        {
            Product? product = await dbContext.Products.SingleOrDefaultAsync(p => p.Id == request.ProductId)
                ?? throw new NotFoundException("Không tìm thấy sản phẩm");

            Size? size = await dbContext.Sizes.SingleOrDefaultAsync(s => s.Id == request.SizeId)
                ?? throw new NotFoundException("Không tìm thấy kích cỡ");

            Color? color = await dbContext.Colors.SingleOrDefaultAsync(c => c.Id == request.ColorId)
                ?? throw new NotFoundException("Không tìm thấy màu sắc");

            ProductVariant variant = new ProductVariant();
            variant.ProductId = request.ProductId;
            variant.SizeId = request.SizeId;
            variant.ColorId = request.ColorId;
            variant.InStock = request.InStock;
            variant.Images = new List<ProductVariantImage>();

            try
            {
                var thumbnailUrl = await uploadService.UploadSingleFileAsync(request.ThumbnailUrl[0]);
                variant.ThumbnailUrl = thumbnailUrl;
                var images = await uploadService.UploadMutlipleFilesAsync(request.Images ?? new List<IFormFile>());

                foreach (var image in images)
                {
                    ProductVariantImage imageVariant = new ProductVariantImage();
                    imageVariant.Url = image;
                    variant.Images.Add(imageVariant);
                }
            } catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

            var savedVariant = await dbContext.ProductVariants.AddAsync(variant);
            await dbContext.SaveChangesAsync();

            var response = new DataResponse<VariantResource>();
            response.StatusCode = System.Net.HttpStatusCode.Created;
            response.Success = true;
            response.Message = "Thêm sản phẩm thành công";
            response.Data = applicationMapper.MapToVariantResource(savedVariant.Entity);

            return response;
               
        }

        public async Task<BaseResponse> GetAllVariants(int pageIndex, int pageSize, string searchString)
        {
            string lowerString = searchString?.ToLower() ?? string.Empty;

            var queryable = dbContext.ProductVariants
                .AsNoTracking()
                .Include(p => p.Product)
                .Where(v => !v.IsDeleted && (string.IsNullOrEmpty(lowerString) || v.Product.Name.ToLower().Contains(lowerString)));

            int totalItems = await queryable.CountAsync();

            if(lowerString != null && lowerString.Length > 1)
            {
                pageIndex = 1;
            }

            List<ProductVariant> variants = await queryable
                .Include(p => p.Color)
                .Include(p => p.Size)
                .Include(p => p.Images)
                .Skip((pageIndex - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var response = new PaginationResponse<List<VariantResource>>
            {
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true,
                Message = "Lấy danh sách sản phẩm thành công",
                Data = variants.Select(variant => applicationMapper.MapToVariantResource(variant)).ToList(),
                Pagination = new Pagination()
                {
                    TotalItems = totalItems,
                    TotalPages = (int)Math.Ceiling((double)totalItems / pageSize),
                    PageIndex = pageIndex,
                    PageSize = pageSize,
                }
            };

            return response;
        }

        public async Task<BaseResponse> GetAllVariantsByProductId(int productId)
        {
            List<ProductVariant> variants = await dbContext.ProductVariants
                .Include(p => p.Color)
                .Include(p => p.Size)
                .Where(p => p.ProductId == productId && !p.IsDeleted).ToListAsync();

            var response = new DataResponse<List<VariantResource>>();
            response.StatusCode = System.Net.HttpStatusCode.OK;
            response.Success = true;
            response.Message = "Lấy danh sách sản phẩm thành công";
            response.Data = variants.Select(variant => applicationMapper.MapToVariantResource(variant)).ToList();

            return response;
        }

        public async Task<BaseResponse> GetAllVariantsByProductIdAndColorId(int productId, int colorId)
        {
            var variants = await dbContext.ProductVariants
             .Where(p => p.ProductId == productId && p.ColorId == colorId && !p.IsDeleted)
             .Include(p => p.Color)
             .Include(p => p.Size)
             .ToListAsync();

            var response = new DataResponse<List<VariantResource>>();
            response.StatusCode = System.Net.HttpStatusCode.OK;
            response.Success = true;
            response.Message = "Lấy danh sách sản phẩm thành công";
            response.Data = variants.Select(variant => applicationMapper.MapToVariantResource(variant)).ToList();

            return response;
        }

        public async Task<BaseResponse> GetUniqueColorVariantsByProductId(int productId)
        {
            var variants = await dbContext.ProductVariants
             .Where(p => p.ProductId == productId && !p.IsDeleted)
             .Include(p => p.Color)
             .Include(p => p.Size)
             .GroupBy(p => p.ColorId)  
             .Select(g => g.First())  
             .ToListAsync();

            var response = new DataResponse<List<VariantResource>>();
            response.StatusCode = System.Net.HttpStatusCode.OK;
            response.Success = true;
            response.Message = "Lấy danh sách sản phẩm thành công";
            response.Data = variants.Select(variant => applicationMapper.MapToVariantResource(variant)).ToList();

            return response;
        }

        public async Task<BaseResponse> GetUniqueSizeVariantsByProductId(int productId)
        {
            var variants = await dbContext.ProductVariants
             .Where(p => p.ProductId == productId && !p.IsDeleted)
             .Include(p => p.Color)
             .Include(p => p.Size)
             .GroupBy(p => p.SizeId)
             .Select(g => g.First())
             .ToListAsync();

            var response = new DataResponse<List<VariantResource>>();
            response.StatusCode = System.Net.HttpStatusCode.OK;
            response.Success = true;
            response.Message = "Lấy danh sách sản phẩm thành công";
            response.Data = variants.Select(variant => applicationMapper.MapToVariantResource(variant)).ToList();

            return response;
        }

        public async Task<BaseResponse> GetVariantById(int id)
        {
            var variant = await dbContext.ProductVariants
                .Include(v => v.Size)
                .Include(v => v.Color)
                .Include(v => v.Images)
                .Include(v => v.Product)
                .SingleOrDefaultAsync(v => v.Id == id && !v.IsDeleted)
                    ?? throw new NotFoundException("Không tìm thấy sản phẩm nào");

            var response = new DataResponse<VariantResource>();
            response.StatusCode = System.Net.HttpStatusCode.OK;
            response.Success = true;
            response.Message = "Lấy danh sách sản phẩm thành công";
            response.Data = applicationMapper.MapToVariantResource(variant);

            return response;
        }

        public async Task RemoveImages(List<int> ids)
        {
            foreach (int item in ids)
            {
                ProductVariantImage? productImage = await dbContext.ProductVariantImages
                    .FindAsync(item);

                if (productImage == null)
                    continue;

                dbContext.ProductVariantImages.Remove(productImage);
            }

            await dbContext.SaveChangesAsync();
        }

        public async Task RemoveVariant(int id)
        {
            var variant = await dbContext.ProductVariants
               .Include(v => v.Images)
               .Include (v => v.OrderItems)
               .SingleOrDefaultAsync(v => v.Id == id && !v.IsDeleted)
                   ?? throw new NotFoundException("Không tìm thấy sản phẩm nào");

            if(variant.OrderItems != null && variant.OrderItems.Any())
            {
                variant.IsDeleted = true;
            } else
            {
                if(variant.Images != null && variant.Images.Any())
                {
                    dbContext.ProductVariantImages.RemoveRange(variant.Images);
                } else
                {
                    dbContext.ProductVariants.Remove(variant);
                }
            }

            int rows = await dbContext.SaveChangesAsync();

            if (rows == 0) throw new Exception("Xóa sản phẩm thất bại");
        }

        public async Task UpdateVariant(int id, EditVariantRequest request)
        {
            var variant = await dbContext.ProductVariants
                .SingleOrDefaultAsync(v => v.Id == id && !v.IsDeleted)
                    ?? throw new NotFoundException("Không tìm thấy sản phẩm nào");

            Product? product = await dbContext.Products.SingleOrDefaultAsync(p => p.Id == request.ProductId)
                ?? throw new NotFoundException("Không tìm thấy sản phẩm");

            Size? size = await dbContext.Sizes.SingleOrDefaultAsync(s => s.Id == request.SizeId)
                ?? throw new NotFoundException("Không tìm thấy kích cỡ");

            Color? color = await dbContext.Colors.SingleOrDefaultAsync(c => c.Id == request.ColorId)
                ?? throw new NotFoundException("Không tìm thấy màu sắc");

            variant.ProductId = request.ProductId;
            variant.SizeId = request.SizeId;
            variant.ColorId = request.ColorId;
            variant.InStock = request.InStock;

            int rows = await dbContext.SaveChangesAsync();

            if (rows == 0) throw new Exception("Cập nhật sản phẩm thất bại");
        }

        public async Task UploadImages(int id, List<IFormFile> files)
        {
            var variant = await dbContext.ProductVariants
                .Include(v => v.Images)
                .SingleOrDefaultAsync(v => v.Id == id && !v.IsDeleted)
                    ?? throw new NotFoundException("Không tìm thấy sản phẩm nào");

            List<string> otherImages = await uploadService.UploadMutlipleFilesAsync(files);
            foreach (var image in otherImages)
            {
                ProductVariantImage productImage = new ProductVariantImage();
                productImage.Url = image;
                variant.Images.Add(productImage);
            }

            int rows = await dbContext.SaveChangesAsync();

            if (rows == 0) throw new Exception("Thêm các ảnh sản phẩm thất bại");
        }

        public async Task UploadThumbnail(int id, IFormFile file)
        {
            var variant = await dbContext.ProductVariants
                .SingleOrDefaultAsync(v => v.Id == id && !v.IsDeleted)
                    ?? throw new NotFoundException("Không tìm thấy sản phẩm nào");

            string thumbnail = await uploadService.UploadSingleFileAsync(file);
            variant.ThumbnailUrl = thumbnail;
            int rows = await dbContext.SaveChangesAsync();

            if (rows == 0) throw new Exception("Cập nhật ảnh sản phẩm thất bại");
        }
    }
}
