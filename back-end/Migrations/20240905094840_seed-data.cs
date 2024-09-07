using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace back_end.Migrations
{
    /// <inheritdoc />
    public partial class seeddata : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "01558d93-358e-4582-bf85-85d792828d2f", "1", "CUSTOMER", "CUSTOMER" },
                    { "b26ea1da-d91d-47b6-bd47-5365660b3e9a", "1", "ADMIN", "ADMIN" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "AccessFailedCount", "Avatar", "ConcurrencyStamp", "CoverImage", "Email", "EmailConfirmed", "FullName", "IsLocked", "IsOnline", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "RecentOnlineTime", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "3a967665-4317-4805-8bfc-b99549fa905a", 0, null, "95b094ce-238b-4004-b15e-f6dd83097d92", null, "hungktpm1406@gmail.com", true, "Đạo Thanh Hưng", false, false, false, null, "HUNGKTPM1406@GMAIL.COM", "ADMIN", "AQAAAAEAACcQAAAAEGTzQeQdyJjoxMS7MGD6m7uAWIqefzxfkzz5erlqtzW8XbKWfE4E1RITqCpjRA7+yw==", "0394488235", false, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "079d175b-ea89-4600-b0a7-7acc79508bba", false, "admin" });

            migrationBuilder.InsertData(
                table: "UserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "b26ea1da-d91d-47b6-bd47-5365660b3e9a", "3a967665-4317-4805-8bfc-b99549fa905a" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: "01558d93-358e-4582-bf85-85d792828d2f");

            migrationBuilder.DeleteData(
                table: "UserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "b26ea1da-d91d-47b6-bd47-5365660b3e9a", "3a967665-4317-4805-8bfc-b99549fa905a" });

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: "b26ea1da-d91d-47b6-bd47-5365660b3e9a");

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: "3a967665-4317-4805-8bfc-b99549fa905a");
        }
    }
}
