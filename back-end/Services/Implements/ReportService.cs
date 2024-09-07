﻿using back_end.Core.Constants;
using back_end.Core.Models;
using back_end.Core.Responses;
using back_end.Core.Responses.Report;
using back_end.Data;
using back_end.Mappers;
using back_end.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace back_end.Services.Implements
{
    public class ReportService : IReportService
    {
        private readonly MyStoreDbContext dbContext;
        private readonly ApplicationMapper applicationMapper;

        public ReportService(MyStoreDbContext dbContext, ApplicationMapper mapper)
        {
            this.dbContext = dbContext;
            applicationMapper = mapper;
        }

        public async Task<BaseResponse> GetReportData()
        {
            int products = await dbContext.Products.CountAsync();
            int categories = await dbContext.Categories.CountAsync();
            int orders = await dbContext.Orders.CountAsync();
            int users = await dbContext.Users.CountAsync();

            var report = new ReportResource()
            {
                Products = products,
                Categories = categories,
                Orders = orders,
                Accounts = users,
            };

            var orderQueryable = dbContext.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(o => o.ProductVariant)
                .ThenInclude(o => o.Product);

            var newestOrders = orderQueryable
                .Take(Math.Min(5, orders))
                .OrderByDescending(o => o.CreatedAt)
                .ToList();

            report.NewestOrders = newestOrders.Select(o => applicationMapper.MapToOrderResource(o)).ToList();
            
            var response = new DataResponse<ReportResource>()
            {
                Data = report,
                Message = "Lấy dữ liệu báo cáo thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };

            return response;
        }

        public async Task<BaseResponse> GetOrderPercentInRangeYear(int year)
        {
            var queryable = dbContext.Orders
                .Where(o => o.CreatedAt.Year == year);
                

            var orders = queryable
                .GroupBy(o => o.CreatedAt.Month)
                .Select(o => 
                    new OrderReport {
                        Month = o.Key,
                        Percent = (o.Count() * 100) / queryable.Count(),
                        Total = o.Count(),
                }).ToList();

            for(int i = 1; i <= 12; i++)
            {
                if(orders.Any(o => o.Month == i))
                    continue;

                var orderReport = new OrderReport
                {
                    Month = i,
                    Percent = 0,
                    Total = 0
                };

                orders.Add(orderReport);
            }

            var response = new DataResponse<List<OrderReport>>()
            {
                Data = orders.OrderBy(o => o.Month).ToList(),
                Message = "Lấy dữ liệu báo cáo đơn hàng thành công",
                Success = true,
                StatusCode = System.Net.HttpStatusCode.OK,
            };

            return response;
        }

        public async Task<BaseResponse> GetTopFiveBestSellerProducts(DateTime? fromTime, DateTime? toTime)
        {
            int products = await dbContext.Products.CountAsync();

            IQueryable<Order> orderQueryable = dbContext.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(o => o.ProductVariant)
                .ThenInclude(o => o.Product);

            if (fromTime != null)
            {
                orderQueryable = orderQueryable.Where(o => o.CreatedAt >= fromTime && o.CreatedAt <= toTime);
            }

            var topBestSellerProducts= dbContext.Orders
                .SelectMany(o => o.OrderItems)
                .GroupBy(oi => oi.ProductVariant.Product)
                .Select(g => new ProductReport
                {
                    Product = applicationMapper.MapToProductResource(g.Key),
                    Quantity = g.Sum(oi => oi.Quantity)
                })
                .OrderByDescending(x => x.Quantity)
                .Take(Math.Min(5, products))
                .ToList();

            var response = new DataResponse<List<ProductReport>>()
            {
                Data = topBestSellerProducts,
                Message = "Lấy dữ liệu top 5 sản phẩm thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };

            return response;
        }

        public async Task<BaseResponse> GetOrderByMonth(DateTime time)
        {
            var queryable = dbContext.Orders
                .Where(o => o.CreatedAt.Year == time.Year && o.CreatedAt.Month == time.Month);


            var orders = queryable
                .GroupBy(o => o.OrderStatus)
                .Select(o =>
                    new OrderReportByMonth
                    {
                        OrderStatus = o.Key,
                        Total = o.Count(),
                        Percent = (o.Count() * 100.0) / queryable.Count()
                    }).ToList();

           
            var response = new DataResponse<List<OrderReportByMonth>>()
            {
                Data = orders,
                Message = "Lấy dữ liệu báo cáo đơn hàng thành công",
                Success = true,
                StatusCode = System.Net.HttpStatusCode.OK,
            };

            return response;
        }
    }
}