using System.ComponentModel.DataAnnotations;

namespace back_end.Core.Requests
{
    public class ColorRequest
    {
        [Required(ErrorMessage = "Tên màu không được để trống")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Mã màu không được để trống")]
        public string HexCode { get; set; }
    }
}
