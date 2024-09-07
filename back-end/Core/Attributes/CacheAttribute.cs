using back_end.Configuration;
using back_end.Core.Responses;
using back_end.Infrastructures.Caching;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;
using System.Net;
using System.Text;

namespace back_end.Core.Attributes
{
    public class CacheAttribute : Attribute, IAsyncActionFilter
    {
        private readonly int timeToLiveSeconds;

        public CacheAttribute(int timeToLiveSeconds)
        {
            this.timeToLiveSeconds = timeToLiveSeconds;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var cacheConfiguration = context.HttpContext.RequestServices.GetRequiredService<RedisConfiguration>();

            if (!cacheConfiguration.Enabled)
            {
                await next();
                return;
            }

            var cacheService = context.HttpContext.RequestServices.GetRequiredService<IResponseCacheService>();
            var cacheKey = GenerateCacheKeyFromHttpRequest(context.HttpContext.Request);

            var cacheResponse = await cacheService.GetResponseCacheAsync(cacheKey);

            if (!string.IsNullOrEmpty(cacheResponse))
            {
                context.Result = new ContentResult
                {
                    StatusCode = 200,
                    Content = cacheResponse,
                    ContentType = "application/json"
                };

                return;
            }

            var excutedContext = await next();
            if (excutedContext.Result is OkObjectResult objectResult)
            {
                await cacheService.SetResponseCacheAsync(cacheKey, objectResult.Value!, TimeSpan.FromSeconds(timeToLiveSeconds));
            }
        }

        private static string GenerateCacheKeyFromHttpRequest(HttpRequest request)
        {
            var keyBuilder = new StringBuilder();
            keyBuilder.Append($"{request.Path}");

            foreach (var (key, value) in request.Query.OrderBy(x => x.Key))
            {
                keyBuilder.Append($"|{key}-{value}");
            }

            return keyBuilder.ToString();
        }
    }
}
