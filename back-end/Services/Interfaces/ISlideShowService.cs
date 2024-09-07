using back_end.Core.Requests;
using back_end.Core.Responses;

namespace back_end.Services.Interfaces
{
    public interface ISlideShowService
    {
        public Task<BaseResponse> GetAllSlideShows();
        public Task<BaseResponse> CreateSlideShow(CreateSlideShowRequest request);
        public Task EditSlideShow(int id, EditSlideShowRequest request);
        public Task RemoveSlideShow(int id);
    }
}
