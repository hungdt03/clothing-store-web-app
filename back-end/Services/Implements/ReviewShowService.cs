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
    public class ReviewShowService : IReviewShowService
    {
        private readonly MyStoreDbContext dbContext;
        private readonly ApplicationMapper applicationMapper;

        public ReviewShowService(MyStoreDbContext dbContext, ApplicationMapper applicationMapper)
        {
            this.dbContext = dbContext;
            this.applicationMapper = applicationMapper;
        }

        public async Task<BaseResponse> CreateReviewShow(ReviewShowRequest request)
        {
            
            foreach(var id in request.EvaluationIds)
            {
                Evaluation evaluation = await dbContext.Evaluations
                    .SingleOrDefaultAsync(e => e.Id == id)
                        ?? throw new NotFoundException($"Không tìm thấy đánh giá có id = {id}");

                var reviewShow = new ReviewShow()
                {
                    EvaluationId = id,
                    Evaluation = evaluation
                };
                
                await dbContext.ReviewShows.AddAsync(reviewShow);
            }

            await dbContext.SaveChangesAsync();

            return new BaseResponse()
            {
                Message = "Thêm review mới thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };
        }

        public async Task<BaseResponse> GetAllReviewShows()
        {
            var reviewShows = await dbContext.ReviewShows
                .Include(e => e.Evaluation)
                    .ThenInclude(e => e.User)
                .ToListAsync();

            var response = new DataResponse<List<ReviewShowResource>>()
            {
                Data = reviewShows.Select(e => applicationMapper.MapToReviewShowResource(e)).ToList(),
                Message = "Lấy tất cả review shows thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };

            return response;
        }

        public async Task RemoveReviewShow(int id)
        {
            var reviewShow = await dbContext.ReviewShows
                .SingleOrDefaultAsync(s => s.Id == id)
                    ?? throw new NotFoundException("Không tìm thấy review nào");

            dbContext.ReviewShows.Remove(reviewShow);
            int rows = await dbContext.SaveChangesAsync();
            if (rows == 0) throw new Exception("Xóa review show thất bại");
        }
    }
}
