using System.ComponentModel.DataAnnotations;

namespace back_end.Core.Models
{
    public class ReviewShow
    {
        [Key]
        public int Id { get; set; }
        public Evaluation Evaluation { get; set; }
        public int EvaluationId { get; set; }
    }
}
