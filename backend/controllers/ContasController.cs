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
    public class ContasController : ControllerBase
    {
        private readonly DataContext _context;

        public ContasController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Conta>>> GetContas()
        {
            return await _context.Contas.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Conta>> GetConta(int id)
        {
            var conta = await _context.Contas.FindAsync(id);

            if (conta == null)
            {
                return NotFound();
            }

            return conta;
        }

        [HttpPost]
        public async Task<ActionResult<Conta>> PostConta(CriarContaDto contaDto)
        {
            var novaConta = new Conta
            {
                Nome = contaDto.Nome,
                SaldoInicial = contaDto.SaldoInicial
            };

            _context.Contas.Add(novaConta);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetConta), new { id = novaConta.Id }, novaConta);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutConta(int id, Conta conta)
        {
            if (id != conta.Id)
            {
                return BadRequest();
            }

            _context.Entry(conta).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Contas.Any(e => e.Id == id))
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
        public async Task<IActionResult> DeleteConta(int id)
        {
            var conta = await _context.Contas.FindAsync(id);
            if (conta == null)
            {
                return NotFound();
            }

            _context.Contas.Remove(conta);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}