using Microsoft.EntityFrameworkCore;
using PaymentAPI.Models;

namespace PaymentAPI.Data
{
    public static class DbInitializer
    {
        public static void Initialize(PaymentContext context)
        {
            // Garante que o banco de dados seja criado
            context.Database.EnsureCreated();

            // Verifica se já existem usuários
            if (context.Users.Any())
            {
                return; // Banco de dados já foi inicializado
            }

            // Adiciona dados de exemplo
            var users = new User[]
            {
                new User
                {
                    Name = "Usuário Teste",
                    Email = "teste@email.com",
                    CPF = "12345678901"
                }
            };

            foreach (var user in users)
            {
                context.Users.Add(user);
            }

            context.SaveChanges();
        }
    }
}