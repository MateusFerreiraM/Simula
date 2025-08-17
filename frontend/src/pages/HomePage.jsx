// src/pages/HomePage.jsx

import React from 'react';
import { Container, Typography, Button, Box, Stack } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosInstance';

function HomePage() {
  const navigate = useNavigate(); // 3. Inicialize o hook

  // 4. Crie a função para lidar com o clique
  const handleIniciarEnem = () => {
    // Mostra um feedback para o usuário
    console.log("Iniciando a criação do simulado ENEM...");

    // Faz o POST para o novo endpoint. Não precisamos enviar dados.
    apiClient.post('/gerar-enem/')
      .then(response => {
        const simuladoId = response.data.id;
        navigate(`/simulado/${simuladoId}`);
      })
      .catch(error => {
        console.error("Erro ao criar o simulado ENEM:", error.response.data);
        // Agora o alerta vai mostrar a mensagem de erro específica do backend
        alert(`Não foi possível gerar o simulado ENEM: ${error.response.data.erro}`);
      });
  };

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
          {/* 5. Mude o botão para usar a função onClick */}
          <Button variant="contained" size="large" onClick={handleIniciarEnem}>
            Iniciar Simulado ENEM
          </Button>
          <Button variant="outlined" size="large" component={Link} to="/personalizado">
            Criar Teste Personalizado
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}

export default HomePage;
