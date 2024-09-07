namespace back_end.Core.Requests
{
    public class ResetPasswordRequest
    {
        public string Password { get; set; }
        public string Email { get; set; }
        public string ActivationToken { get; set; }
    }
}
