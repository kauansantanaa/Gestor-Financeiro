
export interface Utilizador {
    id: number;
    nome: string;
    email: string;
  }
  
  
  export interface Categoria {
    id: number;
    nome: string;
    tipo: 'receita' | 'despesa';
  }
  
  
  export interface Conta {
    id: number;
    nome: string;
    saldoInicial: number;
    utilizadorId: number; 
  }
  
  export interface Transacao {
    id: number;
    descricao: string;
    valor: number;
    data: Date;
    tipo: 'receita' | 'despesa';
    contaId: number;     
    categoriaId: number; 
  }