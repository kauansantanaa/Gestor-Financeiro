import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.tsx';
import CategoriasPage from './pages/CategoriasPage.tsx';
import ContasPage from './pages/ContaPage.tsx';
import TransacoesPage from './pages/TransacoesPage.tsx';

import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <CategoriasPage />,
      },
      {
        path: 'contas',
        element: <ContasPage />,
      },
      {
        path: 'transacoes',
        element: <TransacoesPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);