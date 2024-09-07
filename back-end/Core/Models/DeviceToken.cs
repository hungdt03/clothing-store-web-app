﻿using System.ComponentModel.DataAnnotations;

namespace back_end.Core.Models
{
    public class DeviceToken
    {
        [Key]
        public int Id { get; set; }
        public string Token { get; set; }
        public DateTime Timestamp { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
    }
}
