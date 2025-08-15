// src/pages/HomePage.jsx

import React from 'react';
import { Container, Typography, Button, Box, Stack } from '@mui/material';
import { Link } from 'react-router-dom'; // 1. Importe o Link

function HomePage() {
  return (
    <Container maxWidth="sm">
      <Box 
        sx={{ 
          my: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          Bem-vindo ao Simulado Inteligente!
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Escolha um modo de estudo para começar.
        </Typography>

        <Stack spacing={2} direction="column" sx={{ mt: 3, width: '100%' }}>
          <Button variant="contained" size="large">
            Iniciar Simulado ENEM
          </Button>
          {/* 2. Faça o botão usar o componente Link para navegar */}
          <Button variant="outlined" size="large" component={Link} to="/personalizado">
            Criar Teste Personalizado
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}

export default HomePage;