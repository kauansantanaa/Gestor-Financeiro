namespace GestorFinanceiro.Api.Models
{
    public class Categoria
    {
         public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Tipo { get; set; } = string.Empty;
    }
}