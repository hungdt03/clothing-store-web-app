using back_end.Configuration;
using back_end.Helpers;
using back_end.Infrastructures.Caching;
using back_end.Infrastructures.MailSender;
using back_end.Infrastructures.SignalR;
using back_end.Mappers;
using back_end.Middleware;
using back_end.Services.Implements;
using back_end.Services.Interfaces;
using FirebaseAdmin.Messaging;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using StackExchange.Redis;
using back_end.Infrastructures.FCM;
using back_end.Infrastructures.Cloudinary;
using back_end.Infrastructures.JsonWebToken;


namespace back_end.DI
{
    public static class RegistryService
    {
        public static IServiceCollection AddRegistryService(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddHttpContextAccessor();
            services.AddScoped<ApplicationMapper>();
            services.AddScoped<ExceptionHandlerMiddleware>();

            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<IBrandService, BrandService>();
            services.AddScoped<IColorService, ColorService>();
            services.AddScoped<ISizeService, SizeService>();
            services.AddScoped<IVariantService, VariantService>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<IAddressOrderService, AddressOrderService>();
            services.AddScoped<IEvaluationService, EvaluationService>();
            services.AddScoped<IReportService, ReportService>();
            services.AddScoped<IBlogService, BlogService>();
            services.AddScoped<ISlideShowService, SlideShowService>();
            services.AddScoped<IReviewShowService, ReviewShowService>();
            services.AddScoped<IRoleService, RoleService>();
            services.AddScoped<INotificationService, NotificationService>();

            services.AddScoped<IVnpayService, VnpayService>();
            services.AddScoped<IPaypalService, PaypalService>();

            services.AddScoped<IMessageService, MessageService>();
            services.AddScoped<IGroupService, GroupService>();
            services.AddScoped<IFcmService, FcmService>();

            services.AddSingleton<PresenceTracker>();


            services.AddSingleton(x =>
                new PaypalClient(
                    configuration["PayPalOptions:ClientId"],
                    configuration["PayPalOptions:ClientSecret"],
                    configuration["PayPalOptions:Mode"]
                )
            );

         
            services.AddSingleton<FirebaseMessaging>(provider =>
            {
                if (FirebaseApp.DefaultInstance == null)
                {
                    FirebaseApp.Create(new AppOptions
                    {
                        Credential = GoogleCredential.FromFile(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "firebase-service-account.json")),
                    });
                }

                return FirebaseMessaging.DefaultInstance;
            });

            var redisConfiguration = new RedisConfiguration();
            configuration.GetSection(nameof(redisConfiguration)).Bind(redisConfiguration);
            services.AddSingleton(redisConfiguration);
            services.AddSingleton<IConnectionMultiplexer>(_ => ConnectionMultiplexer.Connect(redisConfiguration.ConnectionStrings));
            services.AddStackExchangeRedisCache(option => option.Configuration = redisConfiguration.ConnectionStrings);
            services.AddSingleton<IResponseCacheService,  ResponseCacheService>();

            services.AddScoped<IUploadService, UploadService>();
            services.AddScoped<JwtService>();
            services.AddScoped<MailService>();

            services.Configure<CloudinarySettings>(configuration.GetSection(nameof(CloudinarySettings)));

            return services;
        }
    }
}
