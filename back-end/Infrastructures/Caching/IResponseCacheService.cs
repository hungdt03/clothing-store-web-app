namespace back_end.Infrastructures.Caching
{
    public interface IResponseCacheService
    {
        Task SetResponseCacheAsync(string cacheKey, object response, TimeSpan timeOut);
        Task<string> GetResponseCacheAsync(string cacheKey);
        Task RemoveResponseCacheAsync(string pattern);
    }
}
