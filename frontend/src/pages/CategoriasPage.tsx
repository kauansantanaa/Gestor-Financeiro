import React, { useState, useEffect } from 'react';
import { Categoria } from '../types';

const API_URL = "/api/categorias";

const CategoriasPage: React.FC = () => {
  const [todasAsCategorias, setTodasAsCategorias] = useState<Categoria[]>([]);
  const [valorNome, setValorNome] = useState('');
  const [valorTipo, setValorTipo] = useState<'receita' | 'despesa'>('despesa');
  const [idEmEdicao, setIdEmEdicao] = useState<number | null>(null);

  useEffect(() => {
    buscarCategorias();
  }, []);

  const buscarCategorias = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Falha ao buscar dados");
      }
      const data = await response.json();
      setTodasAsCategorias(data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  const iniciarEdicao = (categoria: Categoria) => {
    setIdEmEdicao(categoria.id);
    setValorNome(categoria.nome);
    setValorTipo(categoria.tipo);
  };

  const cancelarEdicao = () => {
    setIdEmEdicao(null);
    setValorNome('');
    setValorTipo('despesa');
  };

  const processarFormulario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (valorNome.trim() === '') {
      alert('Por favor, insira o nome da categoria.');
      return;
    }

    const isEditing = idEmEdicao !== null;

    try {
      let response;
      if (isEditing) {
        const categoriaAtualizada = {
          id: idEmEdicao,
          nome: valorNome,
          tipo: valorTipo,
        };
        response = await fetch(`${API_URL}/${idEmEdicao}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(categoriaAtualizada),
        });
      } else {
        const novaCategoriaDTO = {
          nome: valorNome,
          tipo: valorTipo,
        };
        response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(novaCategoriaDTO),
        });
      }

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Falha na requisição");
      }

      cancelarEdicao();
      buscarCategorias();

    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
      alert(`Falha ao salvar categoria: ${error}`);
    }
  };

  const removerCategoria = async (idAlvo: number) => {
    if (window.confirm("Tem certeza que deseja apagar esta categoria?")) {
      try {
        const response = await fetch(`${API_URL}/${idAlvo}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error("Falha ao apagar");
        }
        buscarCategorias();
      } catch (error) {
        console.error("Erro ao apagar categoria:", error);
        alert(`Falha ao apagar categoria: ${error}`);
      }
    }
  };

  return (
    <div className="card">
      <h1>Gestão de Categorias</h1>
      <div className="card">
        <h2>{idEmEdicao ? 'Editar Categoria' : 'Adicionar Nova Categoria'}</h2>
        <form onSubmit={processarFormulario}>
          <div className="form-group">
            <label htmlFor="nome">Nome:</label>
            <input id="nome" type="text" value={valorNome} onChange={(e) => setValorNome(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="tipo">Tipo:</label>
            <select id="tipo" value={valorTipo} onChange={(e) => setValorTipo(e.target.value as 'receita' | 'despesa')}>
              <option value="despesa">Despesa</option>
              <option value="receita">Receita</option>
            </select>
          </div>
          <div>
            <button type="submit" className="btn btn-primary">
              {idEmEdicao ? 'Salvar Alterações' : 'Adicionar'}
            </button>
            {idEmEdicao && (
              <button type="button" onClick={cancelarEdicao} className="btn btn-secondary">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="card">
        <h2>Categorias Existentes</h2>
        <ul className="item-list">
          {todasAsCategorias.map(categoria => (
            <li key={categoria.id}>
              <span>{categoria.nome} ({categoria.tipo})</span>
              <div>
                <button onClick={() => iniciarEdicao(categoria)} className="btn btn-edit">Editar</button>
                <button onClick={() => removerCategoria(categoria.id)} className="btn btn-danger">Apagar</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoriasPage;