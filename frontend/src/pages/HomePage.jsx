import React from 'react';
import { Container, Typography, Button, Box, Stack } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosInstance';

/**
 * Página inicial da aplicação. Exibe opções diferentes para usuários
 * logados e visitantes.
 */
function HomePage() {
  const navigate = useNavigate();
  const isUserLoggedIn = !!localStorage.getItem('access_token');

  const handleIniciarEnem = () => {
    apiClient.post('/gerar-enem/')
      .then(response => {
        const simuladoId = response.data.id;
        navigate(`/simulado/${simuladoId}`);
      })
      .catch(error => {
        console.error("Erro ao criar o simulado ENEM:", error.response?.data);
        alert(`Não foi possível gerar o simulado ENEM: ${error.response?.data?.erro}`);
      });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Bem-vindo ao Simulado Inteligente!
        </Typography>

        {isUserLoggedIn ? (
          <>
            <Typography variant="h5" color="text.secondary" paragraph>
              Escolha um modo de estudo para começar.
            </Typography>
            <Stack spacing={2} direction="column" sx={{ mt: 3, width: '100%' }}>
              <Button variant="contained" size="large" onClick={handleIniciarEnem}>
                Iniciar Simulado ENEM
              </Button>
              <Button variant="outlined" size="large" component={Link} to="/personalizado">
                Criar Teste Personalizado
              </Button>
            </Stack>
          </>
        ) : (
          <>
            <Typography variant="h5" color="text.secondary" paragraph>
              Faça login ou crie sua conta para começar a praticar.
            </Typography>
            <Stack spacing={2} direction="row" sx={{ mt: 3 }}>
              <Button variant="contained" size="large" component={Link} to="/login">
                Fazer Login
              </Button>
              <Button variant="outlined" size="large" component={Link} to="/cadastro">
                Cadastrar
              </Button>
            </Stack>
          </>
        )}
      </Box>
    </Container>
  );
}

export default HomePage;