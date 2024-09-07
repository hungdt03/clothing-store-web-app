namespace back_end.Core.Responses.Resources
{
    public class EvaluationResource
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public int Stars { get; set; }
        public DateTime CreatedAt { get; set; }
        public UserResource? User { get; set; }
        public int Favorites { get; set; }
        public bool IsFavoriteIncludeMe { get; set; }
    }

    public class AnalyticEvaluationResource
    {
        public int TotalEvaluation { get; set; }
        public List<StarPercent> StarsPercents { get; set; }
        public double AverageStar { get; set; }
    }

    public class StarPercent
    {
        public int Star { get; set; }
        public int TotalEvaluation { get; set; }
        public double Percent { get; set; }
    }

    public class ReportEvaluationResource
    {
        public List<EvaluationResource> Results { get; set; }
        public AnalyticEvaluationResource Report { get; set; }
    }
}
