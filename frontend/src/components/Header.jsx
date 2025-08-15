// src/components/Header.jsx

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Header() {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        {/* Título do App, que também é um link para a Home */}
        <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          Simulado Inteligente
        </Typography>

        {/* Botões de Navegação */}
        <Box>
          <Button color="inherit" component={RouterLink} to="/login">Login</Button>
          <Button color="inherit" component={RouterLink} to="/cadastro">Cadastrar</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;