import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

// Importação dos componentes de página e layout
import App from './App.jsx';
import MainLayout from './components/MainLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import CustomTestPage from './pages/CustomTestPage';
import SimuladoPage from './pages/SimuladoPage';
import ResultadoPage from './pages/ResultadoPage';
import DashboardPage from './pages/DashboardPage';
import RootRedirect from './components/RootRedirect';

// Definição das rotas no novo formato de objeto
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // O App agora é o elemento raiz que contém o Outlet
    children: [
      // Rotas públicas (sem cabeçalho)
      { path: 'login', element: <LoginPage /> },
      { path: 'cadastro', element: <RegisterPage /> },
      
      // Rotas privadas (com cabeçalho, aninhadas dentro do MainLayout)
      { 
        element: <MainLayout />,
        children: [
          { index: true, element: <RootRedirect /> }, // Rota raiz "/"
          { path: 'home', element: <HomePage /> },
          { path: 'personalizado', element: <CustomTestPage /> },
          { path: 'simulado/:simuladoId', element: <SimuladoPage /> },
          { path: 'resultado/:simuladoId', element: <ResultadoPage /> },
          { path: 'dashboard', element: <DashboardPage /> },
        ]
      }
    ]
  }
]);

// Renderização usando o novo "RouterProvider"
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);