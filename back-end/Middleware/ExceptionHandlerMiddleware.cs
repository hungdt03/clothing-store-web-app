
using back_end.Core.Responses;
using back_end.Exceptions;
using System.Net;

namespace back_end.Middleware
{
    public class ExceptionHandlerMiddleware : IMiddleware
    {
        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try
            {
                await next(context);
            }
            catch (Exception exception)
            {
                await HandleExceptionAsync(exception, context);
            }
        }

        public async Task HandleExceptionAsync(Exception exception, HttpContext context)
        {
            BaseResponse error = new BaseResponse();
            error.Message = exception.Message;
            error.Success = false;

            if (exception is NotFoundException)
            {
                error.StatusCode = HttpStatusCode.NotFound;
            } else if(exception is BadCredentialsException)
            {
                error.StatusCode = HttpStatusCode.Unauthorized;
            } 
            else
            {
                error.StatusCode = HttpStatusCode.BadRequest;
            }

            await context.Response.WriteAsJsonAsync(error);
            
        }
    }

    
}
