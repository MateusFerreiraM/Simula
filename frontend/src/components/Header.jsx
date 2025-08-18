import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Logo from './Logo';

/**
 * Componente de cabeçalho da aplicação.
 * Exibe o logo e os botões de navegação, que mudam
 * de acordo com o estado de autenticação do usuário.
 */
function Header() {
  const navigate = useNavigate();
  const isUserLoggedIn = !!localStorage.getItem('access_token');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    // TODO: Idealmente, a instância do apiClient deveria ser notificada para limpar
    // o header de autorização padrão, caso esteja em uso.
    
    navigate('/login');
    window.location.reload();
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        {/* Layout com logo à esquerda, como você preferiu */}
        <RouterLink to={isUserLoggedIn ? "/home" : "/login"} style={{ textDecoration: 'none', flexGrow: 1 }}>
          <Logo />
        </RouterLink>

        <Box>
          {isUserLoggedIn ? (
            <>
              <Button color="inherit" component={RouterLink} to="/dashboard">Meu Histórico</Button>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
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