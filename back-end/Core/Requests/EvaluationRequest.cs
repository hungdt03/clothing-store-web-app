using System.ComponentModel.DataAnnotations;

namespace back_end.Core.Requests
{
    public class EvaluationRequest
    {
        [Required(ErrorMessage = "ID của sản phẩm không được để trống")]
        public int ProductId { get; set; }
        [Required(ErrorMessage = "Nội dung đánh giá không được để trống")]
        public string Content { get; set; }

        public int Stars { get; set; } = 5;
    }
}
