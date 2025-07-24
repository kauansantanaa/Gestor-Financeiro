import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Transacao, Conta, Categoria } from '../types';

interface ContextoApp { contas: Conta[]; categorias: Categoria[]; }

const API_URL = "/api/transacoes";

const TransacoesPage: React.FC = () => {
  const { contas, categorias } = useOutletContext<ContextoApp>();
  const [listaDeTransacoes, setListaDeTransacoes] = useState<Transacao[]>([]);
  
  const [formDescricao, setFormDescricao] = useState('');
  const [formValor, setFormValor] = useState(0);
  const [formData, setFormData] = useState(new Date().toISOString().substring(0, 10));
  const [formContaId, setFormContaId] = useState<number>(0);
  const [formCategoriaId, setFormCategoriaId] = useState<number>(0);
  const [idEmEdicao, setIdEmEdicao] = useState<number | null>(null);

  useEffect(() => {
    buscarTransacoes();
  }, []);

  useEffect(() => {
    if (contas.length > 0 && formContaId === 0) setFormContaId(contas[0].id);
    if (categorias.length > 0 && formCategoriaId === 0) setFormCategoriaId(categorias[0].id);
  }, [contas, categorias]);

  const buscarTransacoes = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    setListaDeTransacoes(data);
  };

  const obterNomeDaEntidade = (id: number, lista: {id: number, nome: string}[]) => {
    const item = lista.find(item => item.id === id);
    return item ? item.nome : 'N/A';
  };
  
  const limparFormulario = () => {
    setIdEmEdicao(null);
    setFormDescricao('');
    setFormValor(0);
    setFormData(new Date().toISOString().substring(0, 10));
    if (contas.length > 0) setFormContaId(contas[0].id);
    if (categorias.length > 0) setFormCategoriaId(categorias[0].id);
  };

  const prepararEdicao = (transacao: Transacao) => {
    setIdEmEdicao(transacao.id);
    setFormDescricao(transacao.descricao);
    setFormValor(transacao.valor);
    setFormData(new Date(transacao.data).toISOString().substring(0, 10));
    setFormContaId(transacao.contaId);
    setFormCategoriaId(transacao.categoriaId);
  };

  const submeterFormulario = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = idEmEdicao !== null;
    const url = isEditing ? `${API_URL}/${idEmEdicao}` : API_URL;
    const method = isEditing ? 'PUT' : 'POST';
    
    const bodyData = isEditing 
      ? { id: idEmEdicao, descricao: formDescricao, valor: formValor, data: new Date(formData), contaId: formContaId, categoriaId: formCategoriaId, tipo: '' }
      : { descricao: formDescricao, valor: formValor, data: new Date(formData), contaId: formContaId, categoriaId: formCategoriaId };

    await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData),
    });

    limparFormulario();
    buscarTransacoes();
  };

  const apagarTransacao = async (idAlvo: number) => {
    if (window.confirm("Tem certeza que deseja apagar esta transação?")) {
      await fetch(`${API_URL}/${idAlvo}`, { method: 'DELETE' });
      buscarTransacoes();
    }
  };
  
  return (
    <div className="card">
      <h1>Gestão de Transações</h1>
      <div className="card">
        <h2>{idEmEdicao ? 'Editar Transação' : 'Adicionar Nova Transação'}</h2>
        <form onSubmit={submeterFormulario}>
          <div className="form-group">
            <label htmlFor="formDesc">Descrição:</label>
            <input id="formDesc" type="text" value={formDescricao} onChange={e => setFormDescricao(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="formValor">Valor:</label>
            <input id="formValor" type="number" step="0.01" value={formValor} onChange={e => setFormValor(parseFloat(e.target.value))} required />
          </div>
          <div className="form-group">
            <label htmlFor="formData">Data:</label>
            <input id="formData" type="date" value={formData} onChange={e => setFormData(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="formConta">Conta:</label>
            <select id="formConta" value={formContaId} onChange={e => setFormContaId(Number(e.target.value))}>
              {contas.map(conta => <option key={conta.id} value={conta.id}>{conta.nome}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="formCategoria">Categoria:</label>
            <select id="formCategoria" value={formCategoriaId} onChange={e => setFormCategoriaId(Number(e.target.value))}>
              {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nome} ({cat.tipo})</option>)}
            </select>
          </div>
          <div>
            <button type="submit" className="btn btn-primary">{idEmEdicao ? 'Salvar' : 'Adicionar'}</button>
            {idEmEdicao && <button type="button" onClick={limparFormulario} className="btn btn-secondary">Cancelar</button>}
          </div>
        </form>
      </div>
      <div className="card">
        <h2>Transações Recentes</h2>
        <ul className="item-list">
          {listaDeTransacoes.map(transacao => (
            <li key={transacao.id}>
              <span>
                {new Date(transacao.data).toLocaleDateString()}: {transacao.descricao} - 
                <span style={{color: transacao.tipo === 'receita' ? '#4caf50' : '#f44336'}}> R$ {transacao.valor.toFixed(2)} </span>
                (Conta: {obterNomeDaEntidade(transacao.contaId, contas)}, 
                Categoria: {obterNomeDaEntidade(transacao.categoriaId, categorias)})
              </span>
              <div>
                <button onClick={() => prepararEdicao(transacao)} className="btn btn-edit">Editar</button>
                <button onClick={() => apagarTransacao(transacao.id)} className="btn btn-danger">Apagar</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TransacoesPage;