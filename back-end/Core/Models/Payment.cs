using System.ComponentModel.DataAnnotations;

namespace back_end.Core.Models
{
    public class Payment
    {
        [Key]
        public int Id { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? PaymentDate { get; set; }
        public bool Status { get; set; }
        public string PaymentMethod { get; set; }
        public string? PaymentCode { get; set; }
        public Order Order { get; set; }
    }
}
