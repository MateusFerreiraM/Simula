// src/components/Header.jsx

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  // Verifica se o token de acesso existe no localStorage
  const isUserLoggedIn = !!localStorage.getItem('access_token');

  // Função para fazer logout
  const handleLogout = () => {
    // Limpa os tokens do localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    // Remove o cabeçalho de autorização das futuras requisições do axiosInstance
    // (Isso é uma boa prática, mas requer que a instância seja acessível ou reconfigurada)
    // Por enquanto, a limpeza do localStorage é o principal.

    // Redireciona para a página inicial e força a recarga da página
    // para garantir que todos os estados sejam limpos.
    navigate('/login');
    window.location.reload();
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          Simulado Inteligente
        </Typography>

        <Box>
          {isUserLoggedIn ? (
            // Botões para quando o usuário ESTÁ logado
            <>
              <Button color="inherit" component={RouterLink} to="/dashboard">Meu Histórico</Button>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            // Botões para quando o usuário NÃO ESTÁ logado
            <>
              <Button color="inherit" component={RouterLink} to="/login">Login</Button>
              <Button color="inherit" component={RouterLink} to="/cadastro">Cadastrar</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;