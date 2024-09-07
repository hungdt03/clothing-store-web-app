using System.ComponentModel.DataAnnotations;

namespace back_end.Core.Requests
{
    public class SizeRequest
    {
        [Required(ErrorMessage = "Kích cỡ không được để trống")]
        public string ESize { get; set; }

        [Required(ErrorMessage = "Chiều cao tối thiểu không được để trống")]
        public double MinHeight { get; set; }

        [Required(ErrorMessage = "Chiều cao tối đa không được để trống")]
        public double MaxHeight { get; set; }

        [Required(ErrorMessage = "Cân nặng tối thiểu không được để trống")]

        public double MinWeight { get; set; }
        [Required(ErrorMessage = "Cân nặng tối đa không được để trống")]

        public double MaxWeight { get; set; }
    }
}
