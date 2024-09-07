using back_end.Core.Models;
using back_end.Core.Requests;
using back_end.Core.Responses;
using back_end.Data;
using back_end.Infrastructures.Cloudinary;
using back_end.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace back_end.Services.Implements
{
    public class SlideShowService : ISlideShowService
    {
        private readonly MyStoreDbContext dbContext;
        private readonly IUploadService uploadService;

        public SlideShowService(MyStoreDbContext dbContext, IUploadService uploadService)
        {
            this.dbContext = dbContext;
            this.uploadService = uploadService;
        }

        public async Task<BaseResponse> CreateSlideShow(CreateSlideShowRequest request)
        {
            SlideShow slideShow = new SlideShow();
            slideShow.BtnTitle = request.BtnTitle;
            slideShow.Title = request.Title;
            slideShow.Description = request.Description;

            var backgroundImage = await uploadService.UploadSingleFileAsync(request.BackgroundImage);
            slideShow.BackgroundImage = backgroundImage;
            await dbContext.AddAsync(slideShow);
            await dbContext.SaveChangesAsync();

            var response = new BaseResponse()
            {
                StatusCode = System.Net.HttpStatusCode.Created,
                Message = "Thêm slide mới thành công",
                Success = true
            };

            return response;
        }

        public async Task EditSlideShow(int id, EditSlideShowRequest request)
        {
            SlideShow? checkSlideShow = await dbContext.SlideShows
                .SingleOrDefaultAsync(s => s.Id == id)
                    ?? throw new DirectoryNotFoundException("Không tìm thấy slideshow nào");

            checkSlideShow.BtnTitle = request.BtnTitle;
            checkSlideShow.Title = request.Title;
            checkSlideShow.Description = request.Description;

            if(request.BackgroundImage != null)
            {
                var backgroundImage = await uploadService.UploadSingleFileAsync(request.BackgroundImage);
                checkSlideShow.BackgroundImage = backgroundImage;
            }

            int rows = await dbContext.SaveChangesAsync();
            if (rows == 0) throw new Exception("Cập nhật slide thất bại");
        }

        public async Task<BaseResponse> GetAllSlideShows()
        {
            var slideShows = await dbContext.SlideShows.ToListAsync();
            return new DataResponse<List<SlideShow>>()
            {
                Data = slideShows,
                Message = "Lấy tất cả slideshow thành công",
                Success = true,
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }

        public async Task RemoveSlideShow(int id)
        {
            SlideShow? checkSlideShow = await dbContext.SlideShows
                .SingleOrDefaultAsync(s => s.Id == id)
                    ?? throw new DirectoryNotFoundException("Không tìm thấy slideshow nào");

            dbContext.SlideShows.Remove(checkSlideShow);
            int rows = await dbContext.SaveChangesAsync();
            if (rows == 0) throw new Exception("Xóa slide thất bại");

        }
    }
}
