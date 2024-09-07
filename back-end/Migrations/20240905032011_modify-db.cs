using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace back_end.Migrations
{
    /// <inheritdoc />
    public partial class modifydb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.DropColumn(
                name: "LastedTime",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "LatestMessage",
                table: "Groups");

            migrationBuilder.AddColumn<bool>(
                name: "HaveRead",
                table: "Messages",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "ReadAt",
                table: "Messages",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "MessageId",
                table: "Groups",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TotalUnReadMessages",
                table: "Groups",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RecipientId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HaveRead = table.Column<bool>(type: "bit", nullable: false),
                    ReferenceId = table.Column<int>(type: "int", nullable: false),
                    NotificationType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Notifications_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Groups_MessageId",
                table: "Groups",
                column: "MessageId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_UserId",
                table: "Notifications",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Groups_Messages_MessageId",
                table: "Groups",
                column: "MessageId",
                principalTable: "Messages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Groups_Messages_MessageId",
                table: "Groups");

            migrationBuilder.DropTable(
                name: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Groups_MessageId",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "HaveRead",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "ReadAt",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "MessageId",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "TotalUnReadMessages",
                table: "Groups");

            migrationBuilder.AddColumn<DateTime>(
                name: "LastedTime",
                table: "Groups",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "LatestMessage",
                table: "Groups",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

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
    }
}
