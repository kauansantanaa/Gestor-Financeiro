using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GestorFinanceiro.Api.Data;
using GestorFinanceiro.Api.Models;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace GestorFinanceiro.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriasController : ControllerBase
    {
        private readonly DataContext _context;

        public CategoriasController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Categoria>>> GetCategorias()
        {
            return await _context.Categorias.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Categoria>> GetCategoria(int id)
        {
            var categoria = await _context.Categorias.FindAsync(id);

            if (categoria == null)
            {
                return NotFound();
            }

            return categoria;
        }

        [HttpPost]
public async Task<ActionResult<Categoria>> PostCategoria(GestorFinanceiro.Api.Models.DTOs.CategoriaDTO categoriaDTO)
{
    var novaCategoria = new Categoria
    {
        Nome = categoriaDTO.Nome,
        Tipo = categoriaDTO.Tipo
    };

    _context.Categorias.Add(novaCategoria);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetCategoria), new { id = novaCategoria.Id }, novaCategoria);
}

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategoria(int id, Categoria categoria)
        {
            if (id != categoria.Id)
            {
                return BadRequest();
            }

            _context.Entry(categoria).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Categorias.Any(e => e.Id == id))
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
        public async Task<IActionResult> DeleteCategoria(int id)
        {
            var categoria = await _context.Categorias.FindAsync(id);
            if (categoria == null)
            {
                return NotFound();
            }

            _context.Categorias.Remove(categoria);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}