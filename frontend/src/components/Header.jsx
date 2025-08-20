import React from 'react';
import { AppBar, Toolbar, Button, Box, Container } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Logo from './Logo';

function Header() {
  const navigate = useNavigate();
  const isUserLoggedIn = !!localStorage.getItem('access_token');

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'center' }}>
          
          <RouterLink to={isUserLoggedIn ? "/home" : "/login"} style={{ textDecoration: 'none' }}>
            <Logo />
          </RouterLink>

          {isUserLoggedIn && (
            <Box sx={{ ml: 4 }}>
              <Button color="inherit" component={RouterLink} to="/dashboard">Meu Histórico</Button>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </Box>
          )}

        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;