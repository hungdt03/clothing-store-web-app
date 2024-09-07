
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using StackExchange.Redis;

namespace back_end.Infrastructures.Caching
{
    public class ResponseCacheService : IResponseCacheService
    {
        private readonly IDistributedCache distributedCache;
        private readonly IConnectionMultiplexer connectionMultiplexer;  

        public ResponseCacheService(IDistributedCache distributedCache, IConnectionMultiplexer connectionMultiplexer)
        {
            this.distributedCache = distributedCache;
            this.connectionMultiplexer = connectionMultiplexer;
        }

        public async Task<string> GetResponseCacheAsync(string cacheKey)
        {
            if (string.IsNullOrWhiteSpace(cacheKey)) return null;
            var response = await distributedCache.GetStringAsync(cacheKey);
            return string.IsNullOrEmpty(response) ? null : response; 

        }

        public async Task RemoveResponseCacheAsync(string pattern)
        {
            if (string.IsNullOrWhiteSpace(pattern))
                throw new ArgumentException("Value cannot be null or white space");

            await foreach(var key in GetMatchPatternKeysAsync(pattern + "*"))
            {
                await distributedCache.RemoveAsync(key);
            }
        }

        private async IAsyncEnumerable<string> GetMatchPatternKeysAsync(string pattern)
        {
            if (string.IsNullOrWhiteSpace(pattern))
                throw new ArgumentException("Value cannot be null or white space");

            foreach(var endpoint in connectionMultiplexer.GetEndPoints())
            {
                var server = connectionMultiplexer.GetServer(endpoint);
                foreach(var key in server.Keys(pattern: pattern))
                {
                    yield return key;
                }
            }
        }

        public async Task SetResponseCacheAsync(string cacheKey, object response, TimeSpan timeOut)
        {
            if (response == null) return;
            var serializeResponse = JsonConvert.SerializeObject(response, new JsonSerializerSettings()
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            }) ;

            await distributedCache.SetStringAsync(cacheKey, serializeResponse, new DistributedCacheEntryOptions()
            {
                AbsoluteExpirationRelativeToNow = timeOut
            });
        }
    }
}
