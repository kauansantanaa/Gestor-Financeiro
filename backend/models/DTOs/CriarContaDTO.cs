namespace GestorFinanceiro.Api.Models.DTOs
{
    public class CriarContaDto
    {
        public string Nome { get; set; } = string.Empty;
        public double SaldoInicial { get; set; }
    }
}