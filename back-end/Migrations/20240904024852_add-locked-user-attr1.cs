using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace back_end.Migrations
{
    /// <inheritdoc />
    public partial class addlockeduserattr1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: "21d7e968-7c20-4c6b-b325-6fa54d963083");

            migrationBuilder.DeleteData(
                table: "UserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "d0f7efe3-73b3-4726-8721-6a5ca12ea6c9", "2ea75e50-9267-4675-812e-aabee68c7557" });

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: "d0f7efe3-73b3-4726-8721-6a5ca12ea6c9");

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: "2ea75e50-9267-4675-812e-aabee68c7557");

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "65b25c63-e67b-4717-8411-7cefb1e1f7f6", "1", "ADMIN", "ADMIN" },
                    { "6b8a37c3-4660-4136-82d0-d0e3369c0811", "1", "CUSTOMER", "CUSTOMER" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "AccessFailedCount", "Avatar", "ConcurrencyStamp", "CoverImage", "Email", "EmailConfirmed", "FullName", "IsLocked", "IsOnline", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "RecentOnlineTime", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "249a2386-bb20-4415-8213-cc77ed90a029", 0, null, "7d7d7b87-78a7-4552-8eb9-c544e1f5b5da", null, "hungktpm1406@gmail.com", true, "Đạo Thanh Hưng", false, false, false, null, "HUNGKTPM1406@GMAIL.COM", "ADMIN", "AQAAAAEAACcQAAAAEATPZh17dr1hN/1xNf7sqCBOOtlA5JgBg4Ynuow4MasdvsXFpwbuyxSLeK9XIQdKnA==", "0394488235", false, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "81230ff6-0bd7-48b5-aa53-f5bb66772bde", false, "admin" });

            migrationBuilder.InsertData(
                table: "UserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "65b25c63-e67b-4717-8411-7cefb1e1f7f6", "249a2386-bb20-4415-8213-cc77ed90a029" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: "6b8a37c3-4660-4136-82d0-d0e3369c0811");

            migrationBuilder.DeleteData(
                table: "UserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "65b25c63-e67b-4717-8411-7cefb1e1f7f6", "249a2386-bb20-4415-8213-cc77ed90a029" });

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: "65b25c63-e67b-4717-8411-7cefb1e1f7f6");

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: "249a2386-bb20-4415-8213-cc77ed90a029");

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "21d7e968-7c20-4c6b-b325-6fa54d963083", "1", "CUSTOMER", "CUSTOMER" },
                    { "d0f7efe3-73b3-4726-8721-6a5ca12ea6c9", "1", "ADMIN", "ADMIN" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "AccessFailedCount", "Avatar", "ConcurrencyStamp", "CoverImage", "Email", "EmailConfirmed", "FullName", "IsLocked", "IsOnline", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "RecentOnlineTime", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "2ea75e50-9267-4675-812e-aabee68c7557", 0, null, "b780c9c1-bb05-4914-9bdb-9e0308b8451c", null, "hungktpm1406@gmail.com", true, "Đạo Thanh Hưng", false, false, false, null, "HUNGKTPM1406@GMAIL.COM", "ADMIN", "AQAAAAEAACcQAAAAEOivweAwNSkCBMbIwDtU06P5fHedZ8pxyvjz/KauXkF5md55ynVgZ0gFL1APb9tAsg==", "0394488235", false, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "00373859-8f7d-4016-9863-04ee6abbe656", false, "admin" });

            migrationBuilder.InsertData(
                table: "UserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "d0f7efe3-73b3-4726-8721-6a5ca12ea6c9", "2ea75e50-9267-4675-812e-aabee68c7557" });
        }
    }
}
