using Microsoft.EntityFrameworkCore;
using GestorFinanceiro.Api.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors();
builder.Services.AddControllers();
builder.Services.AddDbContext<DataContext>(options =>
    options.UseInMemoryDatabase("BD"));

var app = builder.Build();

app.UseCors(policy => policy
    .AllowAnyOrigin()
    .AllowAnyHeader()
    .AllowAnyMethod());

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();

app.Run();