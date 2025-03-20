using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PaymentAPI.Data;
using PaymentAPI.Models;

namespace PaymentAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CreditCardsController : ControllerBase
    {
        private readonly PaymentContext _context;

        public CreditCardsController(PaymentContext context)
        {
            _context = context;
        }

        // GET: api/CreditCards
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CreditCard>>> GetCreditCards()
        {
            return await _context.CreditCards.Include(c => c.User).ToListAsync();
        }

        // GET: api/CreditCards/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CreditCard>> GetCreditCard(int id)
        {
            var creditCard = await _context.CreditCards
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (creditCard == null)
            {
                return NotFound();
            }

            return creditCard;
        }

        // GET: api/CreditCards/User/5
        [HttpGet("User/{userId}")]
        public async Task<ActionResult<IEnumerable<CreditCard>>> GetUserCreditCards(int userId)
        {
            return await _context.CreditCards
                .Where(c => c.UserId == userId)
                .ToListAsync();
        }

        // POST: api/CreditCards
        [HttpPost]
        public async Task<ActionResult<CreditCard>> CreateCreditCard(CreditCard creditCard)
        {
            _context.CreditCards.Add(creditCard);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCreditCard), new { id = creditCard.Id }, creditCard);
        }

        // PUT: api/CreditCards/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCreditCard(int id, CreditCard creditCard)
        {
            if (id != creditCard.Id)
            {
                return BadRequest();
            }

            creditCard.UpdatedAt = DateTime.UtcNow;
            _context.Entry(creditCard).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CreditCardExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/CreditCards/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCreditCard(int id)
        {
            var creditCard = await _context.CreditCards.FindAsync(id);
            if (creditCard == null)
            {
                return NotFound();
            }

            _context.CreditCards.Remove(creditCard);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CreditCardExists(int id)
        {
            return _context.CreditCards.Any(e => e.Id == id);
        }
    }
} 