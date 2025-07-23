using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GestorFinanceiro.Api.Data;
using GestorFinanceiro.Api.Models;
using GestorFinanceiro.Api.Models.DTOs;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace GestorFinanceiro.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransacoesController : ControllerBase
    {
        private readonly DataContext _context;

        public TransacoesController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transacao>>> GetTransacoes()
        {
            return await _context.Transacoes.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Transacao>> GetTransacao(int id)
        {
            var transacao = await _context.Transacoes.FindAsync(id);
            if (transacao == null)
            {
                return NotFound();
            }
            return transacao;
        }

        [HttpPost]
        public async Task<ActionResult<Transacao>> PostTransacao(CriarTransacaoDTO transacaoDTO)
        {
            var categoria = await _context.Categorias.FindAsync(transacaoDTO.CategoriaId);
            if (categoria == null)
            {
                return BadRequest("Categoria inválida.");
            }

            var novaTransacao = new Transacao
            {
                Descricao = transacaoDTO.Descricao,
                Valor = transacaoDTO.Valor,
                Data = transacaoDTO.Data,
                ContaId = transacaoDTO.ContaId,
                CategoriaId = transacaoDTO.CategoriaId,
                Tipo = categoria.Tipo
            };

            _context.Transacoes.Add(novaTransacao);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTransacao), new { id = novaTransacao.Id }, novaTransacao);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTransacao(int id, Transacao transacao)
        {
            if (id != transacao.Id)
            {
                return BadRequest();
            }

            var categoria = await _context.Categorias.FindAsync(transacao.CategoriaId);
            if (categoria == null)
            {
                return BadRequest("Categoria inválida.");
            }
            transacao.Tipo = categoria.Tipo;
            
            _context.Entry(transacao).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Transacoes.Any(e => e.Id == id))
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransacao(int id)
        {
            var transacao = await _context.Transacoes.FindAsync(id);
            if (transacao == null)
            {
                return NotFound();
            }

            _context.Transacoes.Remove(transacao);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}