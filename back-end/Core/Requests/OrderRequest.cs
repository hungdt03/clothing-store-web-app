namespace back_end.Core.Requests
{
    public class OrderRequest
    {
        public List<OrderItemRequest> Items { get; set; }
        public string? Note { get; set; }
        public int AddressOrderId { get; set; }
    }



    public class OrderItemRequest
    {
        public int VariantId { get; set; }
        public int Quantity { get; set; }
    }
}
