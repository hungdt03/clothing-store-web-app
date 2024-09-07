using System.ComponentModel.DataAnnotations;

namespace back_end.Core.Models
{
    public class SlideShow


    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string BtnTitle { get; set; }
        public string BackgroundImage { get; set; }
        public int Order { get; set; }
    }
}
