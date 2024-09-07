namespace back_end.Core.Responses
{
    public class PaginationResponse<T> : BaseResponse
    {
        public T Data { get; set; }
        public Pagination Pagination { get; set; }
    }

    public class Pagination
    {
        public int TotalPages { get; set; }
        public int TotalItems { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
    }
}
