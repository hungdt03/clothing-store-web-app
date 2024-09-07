namespace back_end.Core.Requests
{
    public class ValidateTokenRequest
    {
        public string Email { get; set; }
        public string ActivationToken { get; set; }
    }
}
