using back_end.Core.Requests;
using back_end.Core.Responses;

namespace back_end.Services.Interfaces
{
    public interface IReviewShowService
    {
        public Task<BaseResponse> GetAllReviewShows();
        public Task<BaseResponse> CreateReviewShow(ReviewShowRequest request);
        public Task RemoveReviewShow(int id);
    }
}
