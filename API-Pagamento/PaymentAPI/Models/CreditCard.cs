using System;
using System.ComponentModel.DataAnnotations;

namespace PaymentAPI.Models
{
    public class CreditCard
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [StringLength(16)]
        public string CardNumber { get; set; }

        [Required]
        [StringLength(100)]
        public string CardHolderName { get; set; }

        [Required]
        [StringLength(5)]
        public string ExpirationDate { get; set; }

        [Required]
        [StringLength(4)]
        public string CVV { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navegação
        public User User { get; set; }
    }
}