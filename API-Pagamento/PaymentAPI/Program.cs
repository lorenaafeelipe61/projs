using Microsoft.EntityFrameworkCore;
using PaymentAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Configuração da porta específica
builder.WebHost.UseUrls("http://localhost:50100");

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Payment API",
        Version = "v1",
        Description = "API para gerenciamento de pagamentos"
    });
});

// Configuração do banco de dados PostgreSQL com logs detalhados
builder.Services.AddDbContext<PaymentContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
           .EnableSensitiveDataLogging() // Habilita logs detalhados
           .EnableDetailedErrors(); // Habilita erros detalhados
});

// Configuração do CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Payment API V1");
    c.RoutePrefix = string.Empty;
});

// Inicializa o banco de dados com logs detalhados
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<PaymentContext>();
        var logger = services.GetRequiredService<ILogger<Program>>();

        logger.LogInformation("Tentando conectar ao banco de dados...");

        // Tenta conectar ao banco de dados
        context.Database.OpenConnection();
        logger.LogInformation("Conexão com o banco de dados estabelecida com sucesso!");

        // Verifica se o banco de dados existe
        if (!context.Database.CanConnect())
        {
            logger.LogError("Não foi possível conectar ao banco de dados!");
            throw new Exception("Não foi possível conectar ao banco de dados!");
        }

        logger.LogInformation("Iniciando inicialização do banco de dados...");
        DbInitializer.Initialize(context);
        logger.LogInformation("Banco de dados inicializado com sucesso!");
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Ocorreu um erro ao inicializar o banco de dados. Detalhes: {Message}", ex.Message);
        throw; // Re-throw para ver o erro completo no console
    }
}

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();
app.Run();