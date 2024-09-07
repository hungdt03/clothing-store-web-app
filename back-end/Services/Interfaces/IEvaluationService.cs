using back_end.Core.Requests;
using back_end.Core.Responses;

namespace back_end.Services.Interfaces
{
    public interface IEvaluationService
    {
        Task<BaseResponse> CreateEvaluation(EvaluationRequest request);
        Task<BaseResponse> GetAllByProductId(int productId, int pageIndex, int pageSize);
        Task InteractEvaluation(int id);
        Task<BaseResponse> GetAllExcellentEvaluation();
    }
}
