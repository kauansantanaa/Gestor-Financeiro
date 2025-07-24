import { Categoria, Conta, Transacao } from '../types';

export const DADOS_CATEGORIAS: Categoria[] = [
  { id: 1, nome: 'Salário', tipo: 'receita' },
  { id: 2, nome: 'Alimentação', tipo: 'despesa' },
  { id: 3, nome: 'Transporte', tipo: 'despesa' },
  { id: 4, nome: 'Lazer', tipo: 'despesa' },
];

export const DADOS_CONTAS: Conta[] = [
  { id: 1, nome: 'Kauan Santana', saldoInicial: 10000.0, utilizadorId: 1 },
];

export const DADOS_TRANSACOES: Transacao[] = [
    { id: 1, descricao: 'Salário Mensal', valor: 10000, data: new Date('2025-07-05'), tipo: 'receita', contaId: 2, categoriaId: 1 },
];