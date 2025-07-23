namespace GestorFinanceiro.Api.Models.DTOs
{
    public class CriarTransacaoDTO
    {
        public string Descricao { get; set; } = string.Empty;
        public double Valor { get; set; }
        public DateTime Data { get; set; }
        public int ContaId { get; set; }
        public int CategoriaId { get; set; }
    }
}