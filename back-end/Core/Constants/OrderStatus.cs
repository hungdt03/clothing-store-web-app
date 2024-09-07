namespace back_end.Core.Constants
{
    public static class OrderStatus
    {
        public const string WAITING_PAYMENT = "Chờ thanh toán";
        public const string PENDING = "Đang chờ";
        public const string CONFIRMED = "Đã xác nhận";
        public const string REJECTED = "Đã từ chối";
        public const string CANCELLED = "Đã hủy";
        public const string DELIVERING = "Đang vận chuyển";
        public const string DELIVERED = "Đã giao";
        public const string COMPLETED = "Đã hoàn thành";
    }
}
