namespace back_end.Core.Responses
{
    public class DataResponse<T> : BaseResponse
    {
        public T Data { get; set; }
    }
}
