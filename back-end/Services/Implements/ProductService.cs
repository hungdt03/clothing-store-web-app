using Azure.Core;
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
using System.Net;

namespace back_end.Services.Implements
{
    public class ProductService : IProductService
    {
        private readonly MyStoreDbContext dbContext;
        private readonly IUploadService uploadService;
        private readonly ApplicationMapper applicationMapper;

        public ProductService(MyStoreDbContext dbContext, IUploadService uploadService, ApplicationMapper applicationMapper)
        {
            this.dbContext = dbContext;
            this.uploadService = uploadService;
            this.applicationMapper = applicationMapper;
        }

        public async Task UploadImages(int id, List<IFormFile> files)
        {
            Product? product = await dbContext.Products
                .Include(p => p.Images)
                .SingleOrDefaultAsync(p => p.Id == id && !p.IsDeleted)
                    ?? throw new NotFoundException("Không tìm thấy sản phẩm");

            List<string> otherImages = await uploadService.UploadMutlipleFilesAsync(files);
            foreach (var image in otherImages)
            {
                ProductImage productImage = new ProductImage();
                productImage.Url = image;
                product.Images.Add(productImage);
            }

            int rows = await dbContext.SaveChangesAsync();

            if (rows == 0) throw new Exception("Thêm các ảnh sản phẩm thất bại");
        }

        public async Task<BaseResponse> CreateProduct(CreateProductRequest request)
        {
            Brand? brand = await dbContext.Brands
                    .SingleOrDefaultAsync(b => b.Id == request.BrandId)
                        ?? throw new NotFoundException("Không tìm thấy thương hiệu");

            Category? category = await dbContext.Categories
                .SingleOrDefaultAsync(b => b.Id == request.CategoryId)
                    ?? throw new NotFoundException("Không tìm thấy danh mục");

            try
            {
                
                string thumbnail = await uploadService.UploadSingleFileAsync(request.Thumbnail[0]);
                string zoomImage = await uploadService.UploadSingleFileAsync(request.ZoomImage[0]);
               

                Product product = new Product();
                product.Thumbnail = thumbnail;
                product.ZoomImage = zoomImage;
                product.Name = request.Name;
                product.Description = request.Description;
                product.OldPrice = request.OldPrice;
                product.Price = request.Price;
                product.PurchasePrice = request.PurchasePrice;
                product.BrandId = request.BrandId;
                product.CategoryId = request.CategoryId;
                product.Images = new List<ProductImage>();

                if(request.OtherImages != null)
                {
                    List<string> otherImages = await uploadService.UploadMutlipleFilesAsync(request.OtherImages!);
                    foreach (var image in otherImages)
                    {
                        ProductImage productImage = new ProductImage();
                        productImage.Url = image;
                        product.Images.Add(productImage);
                    }
                }
               
                await dbContext.Products.AddAsync(product);
                await dbContext.SaveChangesAsync();

                var response = new DataResponse<ProductResource>();
                response.Message = "Thêm sản phẩm mới thành công";
                response.Success = true;
                response.StatusCode = System.Net.HttpStatusCode.Created;
                response.Data = applicationMapper.MapToProductResource(product);

                return response;

            } catch (Exception ex) 
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<BaseResponse> GetAllProducts(int pageIndex, int pageSize, double minPrice, double maxPrice, List<int> brandIds, List<int> categoryIds, List<int> colorIds, List<int> sizeIds, string sortBy, string sortOrder)
        {
          
            var productsQuery = dbContext.Products.Where(p => p.IsDeleted == false)
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.Images)
                .Include(p => p.ProductVariants)
                    .ThenInclude(pv => pv.Size)
                .Include(p => p.ProductVariants)
                    .ThenInclude(pv => pv.Color)
                .AsQueryable();

            if (categoryIds != null && categoryIds.Any())
            {
                productsQuery = productsQuery.Where(p => categoryIds.Contains(p.CategoryId.Value));
            }

            if (brandIds != null && brandIds.Any())
            {
                productsQuery = productsQuery.Where(p => brandIds.Contains(p.BrandId.Value));
            }

            if(maxPrice > 0 && minPrice <= maxPrice)
            {
                productsQuery = productsQuery.Where(p => p.Price >= minPrice && p.Price <= maxPrice);
            }

            if(sortBy != null && sortOrder != null)
            {
                productsQuery = sortBy switch
                {
                    "price" => sortOrder.ToLower() == "asc"
                        ? productsQuery.OrderBy(p => p.Price)
                        : productsQuery.OrderByDescending(p => p.Price),
                    "name" => sortOrder.ToLower() == "asc"
                        ? productsQuery.OrderBy(p => p.Name)
                        : productsQuery.OrderByDescending(p => p.Name),
                    _ => productsQuery 
                };
            }

            if ((sizeIds != null && sizeIds.Any()) || (colorIds != null && colorIds.Any()))
            {
                productsQuery = productsQuery.Where(p => p.ProductVariants.Any(pv =>
                    (sizeIds == null || !sizeIds.Any() || sizeIds.Contains(pv.SizeId)) &&
                    (colorIds == null || !colorIds.Any() || colorIds.Contains(pv.ColorId))));
            }

            var totalItems = await productsQuery.CountAsync();

            var products = await productsQuery
                .Skip((pageIndex - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var response = new PaginationResponse<List<ProductResource>>
            {
                Success = true,
                Message = "Lấy danh sách sản phẩm thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Data = products.Select(p => applicationMapper.MapToProductResource(p)).ToList(),
                Pagination = new Pagination
                {
                    TotalItems = totalItems,
                    TotalPages = products.Count > 0 ? (int)Math.Ceiling((double)totalItems / pageSize) : 0,
                }
            };

            return response;

        }

        public async Task<BaseResponse> GetProductById(int id)
        {
            Product? product = await dbContext.Products
                .Include (p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.Images)
                .Include(p => p.ProductVariants)
                .SingleOrDefaultAsync(p => p.Id == id && p.IsDeleted == false)
                    ?? throw new NotFoundException("Không tìm thấy sản phẩm");

            var response = new DataResponse<ProductResource>();
            response.Success = true;
            response.Message = "Lấy danh sách sản phẩm thành công";
            response.StatusCode = System.Net.HttpStatusCode.OK;
            response.Data = applicationMapper.MapToProductResource(product);
            return response;

        }

        public async Task UpdateProduct(int id, EditProductRequest request)
        {
            Product? product = await dbContext.Products
                .SingleOrDefaultAsync(p => p.Id == id && !p.IsDeleted)
                    ?? throw new NotFoundException("Không tìm thấy sản phẩm");

            Brand? brand = await dbContext.Brands
                    .SingleOrDefaultAsync(b => b.Id == request.BrandId)
                        ?? throw new NotFoundException("Không tìm thấy thương hiệu");

            Category? category = await dbContext.Categories
                .SingleOrDefaultAsync(b => b.Id == request.CategoryId)
                    ?? throw new NotFoundException("Không tìm thấy danh mục");

            product.Name = request.Name;
            product.Description = request.Description;
            product.OldPrice = request.OldPrice;
            product.Price = request.Price;
            product.PurchasePrice = request.PurchasePrice;
            product.BrandId = request.BrandId;
            product.CategoryId = request.CategoryId;
            product.CreatedDate = DateTime.Now;

            int rows = await dbContext.SaveChangesAsync();

            if (rows == 0) throw new Exception("Cập nhật sản phẩm thất bại");
        }

        public async Task UploadThumbnail(int id, IFormFile file)
        {
            Product? product = await dbContext.Products
                .SingleOrDefaultAsync(p => p.Id == id && !p.IsDeleted)
                    ?? throw new NotFoundException("Không tìm thấy sản phẩm");

            string thumbnail = await uploadService.UploadSingleFileAsync(file);
            product.Thumbnail = thumbnail;
            int rows = await dbContext.SaveChangesAsync();

            if (rows == 0) throw new Exception("Cập nhật ảnh sản phẩm thất bại");
        }

        public async Task UploadZoomImage(int id, IFormFile file)
        {
            Product? product = await dbContext.Products
               .SingleOrDefaultAsync(p => p.Id == id && !p.IsDeleted)
                   ?? throw new NotFoundException("Không tìm thấy sản phẩm");

            string zoomImahe = await uploadService.UploadSingleFileAsync(file);
            product.ZoomImage = zoomImahe;
            int rows = await dbContext.SaveChangesAsync();

            if (rows == 0) throw new Exception("Cập nhật ảnh sản phẩm thất bại");
        }

        public async Task RemoveImages(List<int> ids)
        {
            foreach(int item in ids)
            {
                ProductImage? productImage = await dbContext.ProductImages
                    .FindAsync(item);

                if (productImage == null)
                    continue;

                dbContext.ProductImages.Remove(productImage);
            }

            await dbContext.SaveChangesAsync();
        }

        public async Task RemoveProduct(int id)
        {
            Product? product = await dbContext.Products
               .Include(p => p.Images)
               .Include(p => p.ProductVariants)
               .Include(p => p.Evaluations)
               .SingleOrDefaultAsync(p => p.Id == id && !p.IsDeleted)
                   ?? throw new NotFoundException("Không tìm thấy sản phẩm");

            if(
                (product.ProductVariants == null || product.ProductVariants.Count == 0)
                && (product.Evaluations == null || product.Evaluations.Count == 0)
            )
            {
                if(product.Images != null && product.Images.Count > 0)
                {
                    dbContext.ProductImages.RemoveRange(product.Images);
                }

                dbContext.Products.Remove(product);
            } else
            {
                product.IsDeleted = true;
            }

            int rows = await dbContext.SaveChangesAsync();
            if (rows == 0) throw new Exception("Xóa sản phẩm thất bại");
        }

        public async Task<BaseResponse> SearchProduct(string searchValue, int pageIndex, int pageSize)
        {
            string lowerCaseValue = searchValue?.ToLower() ?? "";
            var queryable = dbContext.Products
                .Where(p => p.Name.ToLower().Contains(lowerCaseValue));

            var totalItems = await queryable.CountAsync();
            var products = await queryable
                .Skip((pageIndex - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var response = new PaginationResponse<List<ProductResource>>
            {
                Data = products.Select(p => applicationMapper.MapToProductResource(p)).ToList(),
                Message = $"Tìm thấy {products.Count} cho {searchValue}",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true,
                Pagination = new Pagination
                {
                    TotalItems = totalItems,
                    TotalPages = (int) Math.Ceiling((double)totalItems / pageSize),
                }
            };

            return response;
        }

        public async Task<BaseResponse> GetBestSellerProducts()
        {
            var products = await dbContext.OrderItems
                .Include(o => o.ProductVariant)
                    .ThenInclude(o => o.Product)
                .GroupBy(o => o.ProductVariant.Product)
                .Select(o => new
                {
                    Product = o.Key,
                    Quantity = o.Sum(o => o.Quantity),
                })
                .OrderByDescending(o => o.Quantity)
                .Take(8)
                .ToListAsync();

            var response = new DataResponse<List<ProductResource>>();
            response.Data = products.Select(p => applicationMapper.MapToProductResource(p.Product)).ToList();
            response.Message = "Lấy top sản phẩm bán chạy nhất thành công";
            response.StatusCode = HttpStatusCode.OK;
            response.Success = true;

            return response;

        }

        public async Task<BaseResponse> GetMostFavoriteProducts()
        {
            var products = await dbContext.Evaluations
                .Include(e => e.Product)
                .GroupBy(e => e.Product)
                .Select(e => new
                {
                    Product = e.Key,
                    Quantity = e.Count(),
                    Stars = e.Average(i => i.Stars),
                })
                .OrderByDescending(e => e.Stars)
                .ThenByDescending(e => e.Quantity)
                .Take(8)
                .ToListAsync();

            var response = new DataResponse<List<ProductResource>>();
            response.Data = products.Select(p => applicationMapper.MapToProductResource(p.Product)).ToList();
            response.Message = "Lấy top sản phẩm yêu thích nhất thành công";
            response.StatusCode = HttpStatusCode.OK;
            response.Success = true;

            return response;
        }
    }
}
