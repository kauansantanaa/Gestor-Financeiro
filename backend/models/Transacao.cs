using System;

namespace GestorFinanceiro.Api.Models
{
    public class Transacao
    {
        public int Id { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public double Valor { get; set; }
        public DateTime Data { get; set; }
        public string Tipo { get; set; } = string.Empty;
        public int ContaId { get; set; }
        public int CategoriaId { get; set; }
    }
}