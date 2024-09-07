using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace back_end.Migrations
{
    /// <inheritdoc />
    public partial class addlockeduserattr : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: "9161628a-ea48-4ead-b97e-194c7c87ebf5");

            migrationBuilder.DeleteData(
                table: "UserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "3c46949d-4e8b-485e-89cc-74542f4cd1ad", "e4349924-85f0-4f10-8d68-d763b43e06b4" });

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: "3c46949d-4e8b-485e-89cc-74542f4cd1ad");

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: "e4349924-85f0-4f10-8d68-d763b43e06b4");

            migrationBuilder.AddColumn<bool>(
                name: "IsLocked",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.DropColumn(
                name: "IsLocked",
                table: "Users");

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "3c46949d-4e8b-485e-89cc-74542f4cd1ad", "1", "ADMIN", "ADMIN" },
                    { "9161628a-ea48-4ead-b97e-194c7c87ebf5", "1", "CUSTOMER", "CUSTOMER" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "AccessFailedCount", "Avatar", "ConcurrencyStamp", "CoverImage", "Email", "EmailConfirmed", "FullName", "IsOnline", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "RecentOnlineTime", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "e4349924-85f0-4f10-8d68-d763b43e06b4", 0, null, "3b235ad2-d377-43d1-9780-308453de1afd", null, "hungktpm1406@gmail.com", true, "Đạo Thanh Hưng", false, false, null, "HUNGKTPM1406@GMAIL.COM", "ADMIN", "AQAAAAEAACcQAAAAEH+1PUOK65Cy/lYSHXrsgxcPit1oLLNJv2+E1PXiV4IT5rvdq0EHvMxoqa49KJAxpw==", "0394488235", false, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "13a758ae-c377-48d9-8b0e-4fbed482b2ae", false, "admin" });

            migrationBuilder.InsertData(
                table: "UserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "3c46949d-4e8b-485e-89cc-74542f4cd1ad", "e4349924-85f0-4f10-8d68-d763b43e06b4" });
        }
    }
}
