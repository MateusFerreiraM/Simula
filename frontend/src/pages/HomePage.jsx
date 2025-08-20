import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Typography, Box, Button, CircularProgress } from '@mui/material';
import apiClient from '../api/axiosInstance';

function HomePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get('/auth/users/me/')
      .then(response => {
        setUser(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar dados do usuário:", error);
        setLoading(false);
      });
  }, []);

  const handleGerarEnem = () => {
    console.log("Iniciando criação do simulado ENEM...");
    apiClient.post('/gerar-enem/')
      .then(response => {
        const simuladoId = response.data.id;
        console.log(`Simulado ENEM criado com ID: ${simuladoId}. Navegando...`);
        navigate(`/simulado/${simuladoId}`);
      })
      .catch(error => {
        console.error("Erro ao gerar simulado ENEM:", error);
        alert("Ocorreu um erro ao tentar criar o simulado ENEM. Tente novamente.");
      });
  };

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 8 }} />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        mt: 8,
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom>
        Olá, {user ? user.username : 'visitante'}! <br/>Bem-vindo ao{' '}
        <span style={{ color: 'green', fontWeight: 'bold' }}>Simula</span>
      </Typography>

      <Typography variant="h6" color="textSecondary" sx={{ mb: 4 }}>
        A sua plataforma de preparação para o ENEM e vestibulares
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: '400px' }}>
        <Button
          variant="contained"
          color="success"
          size="large"
          onClick={handleGerarEnem}
        >
          Iniciar Simulado ENEM
        </Button>
        <Button
          variant="outlined"
          color="success"
          size="large"
          component={RouterLink}
          to="/personalizado"
        >
          Criar Teste Personalizado
        </Button>
      </Box>
    </Box>
  );
}

export default HomePage;