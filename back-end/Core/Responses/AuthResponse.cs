using back_end.Core.Responses.Resources;

namespace back_end.Core.Responses
{
    public class AuthResponse
    {
        public string AccessToken { get; set; }
        public UserResource User { get; set; }
    }
}
