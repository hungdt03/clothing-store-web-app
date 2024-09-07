using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using back_end.Core.Responses;

namespace back_end.Validation
{
    public class CustomValidation : IActionFilter
    {
        public void OnActionExecuted(ActionExecutedContext context)
        {
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            if (!context.ModelState.IsValid)
            {
                var firstError = context.ModelState.Values
                    .SelectMany(v => v.Errors)
                    .FirstOrDefault();

                if (firstError != null)
                {
                    var response = new BaseResponse
                    {
                        Success = false,
                        Message = firstError.ErrorMessage,
                        StatusCode = System.Net.HttpStatusCode.UnprocessableEntity
                    };

                    context.Result = new UnprocessableEntityObjectResult(response);

                }
            }
        }
    }
}
