using System;
using System.ComponentModel.DataAnnotations;

namespace PaymentAPI.Models
{
    public class PaymentMethod
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public int CreditCardId { get; set; }

        [Required]
        [StringLength(50)]
        public string PaymentType { get; set; }

        [Required]
        public decimal Amount { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; }

        public string TransactionId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navegação
        public User User { get; set; }
        public CreditCard CreditCard { get; set; }
    }
}