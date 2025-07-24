import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Conta } from '../types';

interface ContextoApp {
  contas: Conta[];
  recarregarDados: () => void;
}

const API_URL = "/api/contas";

const ContaPage: React.FC = () => {
  const { contas, recarregarDados } = useOutletContext<ContextoApp>();
  
  const [valorNome, setValorNome] = useState('');
  const [valorSaldo, setValorSaldo] = useState(0);
  const [idEmEdicao, setIdEmEdicao] = useState<number | null>(null);

  const iniciarEdicao = (conta: Conta) => {
    setIdEmEdicao(conta.id);
    setValorNome(conta.nome);
    setValorSaldo(conta.saldoInicial);
  };

  const cancelarEdicao = () => {
    setIdEmEdicao(null);
    setValorNome('');
    setValorSaldo(0);
  };

  const processarFormulario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (valorNome.trim() === '') {
      alert('Por favor, insira o nome da conta.');
      return;
    }

    const isEditing = idEmEdicao !== null;
    const url = isEditing ? `${API_URL}/${idEmEdicao}` : API_URL;
    const method = isEditing ? 'PUT' : 'POST';
    
    const bodyData = isEditing 
      ? { id: idEmEdicao, nome: valorNome, saldoInicial: valorSaldo, utilizadorId: 1 }
      : { nome: valorNome, saldoInicial: valorSaldo };

    await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData),
    });

    cancelarEdicao();
    recarregarDados();
  };

  const removerConta = async (idAlvo: number) => {
    if (window.confirm("Tem certeza que deseja apagar esta conta?")) {
      await fetch(`${API_URL}/${idAlvo}`, { method: 'DELETE' });
      recarregarDados();
    }
  };

  return (
    <div className="card">
      <h1>Gestão de Contas</h1>
      <div className="card">
        <h2>{idEmEdicao ? 'Editar Conta' : 'Adicionar Nova Conta'}</h2>
        <form onSubmit={processarFormulario}>
          <div className="form-group">
            <label htmlFor="nome">Nome da Conta:</label>
            <input id="nome" type="text" value={valorNome} onChange={(e) => setValorNome(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="saldo">Saldo Inicial:</label>
            <input id="saldo" type="number" step="0.01" value={valorSaldo} onChange={(e) => setValorSaldo(parseFloat(e.target.value))} required />
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
        <h2>Contas Existentes</h2>
        <ul className="item-list">
          {contas.map(conta => (
            <li key={conta.id}>
              <span>{conta.nome} (Saldo Inicial: R$ {conta.saldoInicial.toFixed(2)})</span>
              <div>
                <button onClick={() => iniciarEdicao(conta)} className="btn btn-edit">Editar</button>
                <button onClick={() => removerConta(conta.id)} className="btn btn-danger">Apagar</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContaPage;