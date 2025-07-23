namespace GestorFinanceiro.Api.Models
{
    public class Conta
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public double SaldoInicial { get; set; }
        public int UtilizadorId { get; set; } = 1;
    }
}