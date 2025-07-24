import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Categoria, Conta } from './types';
import './App.css';

const API_BASE_URL = "/api";

const App: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [contas, setContas] = useState<Conta[]>([]);

  const buscarDadosCompartilhados = async () => {
    try {
      const [contasRes, categoriasRes] = await Promise.all([
        fetch(`${API_BASE_URL}/contas`),
        fetch(`${API_BASE_URL}/categorias`)
      ]);
      const contasData = await contasRes.json();
      const categoriasData = await categoriasRes.json();
      setContas(contasData);
      setCategorias(categoriasData);
    } catch (error) {
      console.error("Erro ao buscar dados compartilhados:", error);
    }
  };

  useEffect(() => {
    buscarDadosCompartilhados();
  }, []);

  return (
    <div className="app-container">
      <nav className="app-nav">
        <NavLink to="/">Categorias</NavLink>
        <NavLink to="/contas">Contas</NavLink>
        <NavLink to="/transacoes">Transações</NavLink>
      </nav>
      <main>
        <Outlet context={{ 
          contas, 
          categorias, 
          recarregarDados: buscarDadosCompartilhados 
        }} />
      </main>
    </div>
  );
};

export default App;