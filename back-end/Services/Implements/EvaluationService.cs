using back_end.Core.Models;
using back_end.Core.Requests;
using back_end.Core.Responses;
using back_end.Core.Responses.Resources;
using back_end.Data;
using back_end.Exceptions;
using back_end.Extensions;
using back_end.Mappers;
using back_end.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace back_end.Services.Implements
{
    public class EvaluationService : IEvaluationService
    {
        private readonly MyStoreDbContext dbContext;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly ApplicationMapper applicationMapper;
        private readonly UserManager<User> userManager;

        public EvaluationService(MyStoreDbContext dbContext, IHttpContextAccessor httpContextAccessor, ApplicationMapper applicationMapper, UserManager<User> userManager)
        {
            this.dbContext = dbContext;
            this.httpContextAccessor = httpContextAccessor;
            this.applicationMapper = applicationMapper;
            this.userManager = userManager;
        }

        public async Task<BaseResponse> CreateEvaluation(EvaluationRequest request)
        {
            Product? product = await dbContext.Products
                .SingleOrDefaultAsync(p => p.Id == request.ProductId)
                    ?? throw new NotFoundException("Sản phẩm không tồn tại");

            var userId = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Sid).Value
                ?? throw new BadCredentialsException("Vui lòng đăng nhập lại");

            Evaluation evaluation = new Evaluation();
            evaluation.Stars = request.Stars;
            evaluation.Content = request.Content;
            evaluation.DateCreated = DateTime.Now;
            evaluation.ProductId = request.ProductId;
            evaluation.UserId = userId;

            await dbContext.Evaluations.AddAsync(evaluation);
            await dbContext.SaveChangesAsync();

            var response = new BaseResponse();
            response.StatusCode = System.Net.HttpStatusCode.Created;
            response.Message = "Đánh giá sản phẩm thành công";
            response.Success = true;
            return response;

        }

        public async Task<BaseResponse> GetAllByProductId(int productId, int pageIndex, int pageSize)
        {
            var queryable = dbContext.Evaluations
                .Where(e => e.ProductId == productId)
                .AsQueryable();

            int total = await queryable.CountAsync();
            double averageStar = total > 0 ? await queryable.AverageAsync(e => e.Stars) : 0;

            var starPercents = await queryable
                .GroupBy(e => e.Stars) 
                .Select(g => new StarPercent
                {
                    Star = g.Key, 
                    TotalEvaluation = g.Count(),
                    Percent = ((double)g.Count() / total) * 100
                })
                .ToListAsync();

            var evaluations = await queryable
                .Include(p => p.User)
                .Include(p => p.Favorites)
                .Skip((pageIndex - 1) * pageSize)   
                .Take(pageSize)
                .ToListAsync();

            var resources = new List<EvaluationResource>();
            if(httpContextAccessor.HttpContext.User.Identity.IsAuthenticated)
            {
                var userId = httpContextAccessor.HttpContext.User.GetUserId();
                resources = evaluations.Select(e => applicationMapper.MapToEvaluationResource(e, userId)).ToList();
            } else
            {
                resources = evaluations.Select(e => applicationMapper.MapToEvaluationResourceWithoutPrincipal(e)).ToList();
            }
            var response = new PaginationResponse<ReportEvaluationResource>();
            response.Message = "Lấy danh sách đánh giá thành công";
            response.Success = true;
            response.StatusCode = System.Net.HttpStatusCode.OK;
            response.Data = new ReportEvaluationResource
            {
                Report = new AnalyticEvaluationResource
                {
                    AverageStar = averageStar,
                    StarsPercents = starPercents,
                    TotalEvaluation = total,
                },
                Results = resources
            };

            response.Pagination = new Pagination
            {
                TotalItems = total,
                TotalPages = (int)Math.Ceiling((double)total / pageSize),
            };

            return response;
        }

        public async Task<BaseResponse> GetAllExcellentEvaluation()
        {
            var evaluations = await dbContext.Evaluations
                .Include(e => e.User)
                .Where(e => e.Stars >= 4)
                .Take(3)
                .ToListAsync();

            var response = new DataResponse<List<EvaluationResource>>();
            response.Success = true;
            response.Data = evaluations.Select(e => applicationMapper.MapToEvaluationResourceWithoutPrincipal(e)).ToList();
            response.StatusCode= System.Net.HttpStatusCode.OK;
            return response;
        }

        public async Task InteractEvaluation(int id)
        {
            Evaluation? evaluation = await dbContext.Evaluations
                .Include(e => e.Favorites)
                .SingleOrDefaultAsync(p => p.Id == id)
                    ?? throw new NotFoundException("Đánh giá không tồn tại");

            var userId = httpContextAccessor.HttpContext.User.GetUserId();

            User user = await userManager.FindByIdAsync(userId)
                ?? throw new BadCredentialsException("Vui lòng đăng nhập lại");

            if (evaluation.Favorites != null && evaluation.Favorites.Any(item => item.Id.Equals(userId)))
            {
                evaluation.Favorites.Remove(user);
            } else evaluation.Favorites.Add(user);

            int rows = await dbContext.SaveChangesAsync();
            if (rows == 0) throw new Exception("Tương tác thất bại");
        }
    }
}
