namespace back_end.Core.Responses.Resources
{
    public class SizeResource
    {
        public int Id { get; set; }
        public string ESize { get; set; }
        public double MinWeight { get; set; }
        public double MaxWeight { get; set; }
        public double MaxHeight { get; set; }
        public double MinHeight { get; set; }
    }
}
