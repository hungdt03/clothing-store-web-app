using back_end.Core.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace back_end.Data
{
    public class MyStoreDbContext : IdentityDbContext<User>
    {
        public MyStoreDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }
        public DbSet<ProductVariant> ProductVariants { get; set; }
        public DbSet<ProductVariantImage> ProductVariantImages { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Color> Colors { get; set; }
        public DbSet<Size> Sizes { get; set; }
        public DbSet<Brand> Brands { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderHistory> OrderHistories { get; set; }
        public DbSet<AddressOrder> AddressOrders { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Evaluation> Evaluations { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<MessageImage> MessageImages { get; set; }
        public DbSet<DeviceToken> DeviceTokens { get; set; }
        public DbSet<Blog> Blogs { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Wishlist> Wishlists { get; set; }
        public DbSet<SlideShow> SlideShows { get; set; }
        public DbSet<ReviewShow> ReviewShows { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            foreach (var entityType in builder.Model.GetEntityTypes())
            {
                var tableName = entityType.GetTableName();
                if (tableName!.StartsWith("AspNet"))
                {
                    entityType.SetTableName(tableName.Substring(6));
                }
            }

            builder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany(u => u.Orders)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Category>()
                .HasOne(c => c.ParentCategory)
                .WithMany(c => c.CategoryChildren);

            builder.Entity<Evaluation>()
                .HasOne(o => o.User)
                .WithMany(o => o.Evaluations)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Evaluation>()
                .HasMany(o => o.Favorites)
                .WithMany(o => o.EvaluationFavorites);


            builder.Entity<Message>()
                .HasOne(u => u.Recipient)
                .WithMany(m => m.MessagesReceived)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Message>()
                .HasOne(u => u.Sender)
                .WithMany(m => m.MessagesSent)
                .OnDelete(DeleteBehavior.Restrict);

            SeedingData(builder);
        }

        public void SeedingData(ModelBuilder builder)
        {

            var roles = new List<IdentityRole>()
            {
                new IdentityRole() { Name = "ADMIN", ConcurrencyStamp = "1", NormalizedName = "ADMIN" },
                new IdentityRole() { Name = "CUSTOMER", ConcurrencyStamp = "1", NormalizedName = "CUSTOMER" }
            };

            // ROLE
            builder.Entity<IdentityRole>().HasData(roles);

            // USER
            var appUser = new User
            {
                FullName = "Đạo Thanh Hưng",
                Email = "hungktpm1406@gmail.com",
                NormalizedEmail = "HUNGKTPM1406@GMAIL.COM",
                EmailConfirmed = true,
                UserName = "admin",
                NormalizedUserName = "ADMIN",
                PhoneNumber = "0394488235",
            };

            PasswordHasher<User> hashedPassword = new PasswordHasher<User>();
            appUser.PasswordHash = hashedPassword.HashPassword(appUser, "12345678");

            builder.Entity<User>().HasData(appUser);

            builder.Entity<IdentityUserRole<string>>().HasData(
                new IdentityUserRole<string>() { UserId = appUser.Id, RoleId = roles[0].Id }
            );

        }
    }
}
