import React, { useState, useEffect } from 'react';
// 1. IMPORTADO O "useNavigate" PARA NAVEGAÇÃO A PARTIR DE UMA FUNÇÃO
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Typography, Box, Button, CircularProgress } from '@mui/material';
import apiClient from '../api/axiosInstance';

/**
 * Página inicial da aplicação. Apresenta o projeto e as opções de simulado.
 */
function HomePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // 2. INICIALIZADO O "useNavigate"
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

  // 3. NOVA FUNÇÃO PARA GERAR O SIMULADO ENEM DA FORMA CORRETA
  const handleGerarEnem = () => {
    console.log("Iniciando criação do simulado ENEM...");
    // Primeiro, fazemos o pedido POST para o backend criar o simulado
    apiClient.post('/gerar-enem/')
      .then(response => {
        // Se a criação for bem-sucedida, o backend retorna o novo simulado com seu ID
        const simuladoId = response.data.id;
        console.log(`Simulado ENEM criado com ID: ${simuladoId}. Navegando...`);
        // Agora, com o ID, navegamos para a página correta
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
        {/* 4. SAUDAÇÃO AJUSTADA PARA SER MAIS SEGURA */}
        {/* Verifica se 'user' existe antes de tentar aceder a 'user.username' */}
        Olá, {user ? user.username : 'visitante'}! <br/>Bem-vindo ao{' '}
        <span style={{ color: 'green', fontWeight: 'bold' }}>Simula</span>
      </Typography>

      <Typography variant="h6" color="textSecondary" sx={{ mb: 4 }}>
        A sua plataforma de preparação para o ENEM e vestibulares
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: '400px' }}>
        {/* 5. BOTÃO DO ENEM MODIFICADO */}
        {/* Removemos as propriedades de Link e adicionamos o onClick */}
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