namespace back_end.Core.Responses.Resources
{
    public class OrderResource
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public int Quantity { get; set; }
        public double TotalPrice { get; set; }
        public string OrderStatus { get; set; }
        public string Title { get; set; }
        public string ThumbnailUrl { get; set; }
        public string Note { get; set; }
        public List<OrderItemResource> Items { get; set; }
        public List<OrderProcessItem> OrderSteps { get; set; }
        public PaymentResource Payment { get; set; }
        public AddressOrderResource AddressOrder { get; set; }
        public UserResource User { get; set; }

    }

    public class OrderItemResource
    {
        public int? Id { get; set; }
        public double? Price { get; set; }
        public double? SubTotal { get; set; }
        public int? Quantity { get; set; }
        public int? ProductId { get; set; }
        public string? ProductName { get; set; }
        public double? ProductPrice { get; set; }
        public VariantResource? Variant { get; set; }

    }

    public class OrderProcessItem
    {
        public DateTime? ModifyAt { get; set; }
        public string OrderStatus { get; set; }
        public string? Note { get; set; }
        public bool IsCompleted { get; set; }
    }


    public class OrderHistoryResource
    {
        public int Id { get; set; }
        public DateTime? ModifyAt { get; set; }
        public string OrderStatus { get; set; }
        public string? Note { get; set; }
    }

    public class PaymentResource
    {
        public string PaymentMethod { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool Status { get; set; }
        public string PaymentCode { get; set; }
    }

    public class AddressOrderResource
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public bool IsDefault { get; set; }
    }
}
