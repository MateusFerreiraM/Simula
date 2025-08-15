// src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import apiClient from '../api/axiosInstance';
import { Container, Typography, Box, CircularProgress, List, ListItem, ListItemText, Button, Paper } from '@mui/material';

function DashboardPage() {
  const [simulados, setSimulados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Pega o token de acesso que salvamos no localStorage durante o login
    const token = localStorage.getItem('access_token');

    if (!token) {
      // Idealmente, redirecionaríamos para o login se não houver token
      setLoading(false);
      return;
    }

    // Faz a requisição para o nosso novo endpoint protegido,
    // incluindo o token de autenticação no cabeçalho (header).
    apiClient.get('/meus-simulados/')
    .then(response => {
        setSimulados(response.data);
        setLoading(false);
    })
    .then(response => {
      setSimulados(response.data);
      setLoading(false);
    })
    .catch(error => {
      console.error("Erro ao buscar histórico de simulados:", error);
      // TODO: Tratar erros como token expirado
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Meu Histórico de Simulados
        </Typography>
        {simulados.length > 0 ? (
          <List component={Paper}>
            {simulados.map(simulado => {
              const acertos = simulado.respostas.filter(r => r.correta).length;
              const total = simulado.questoes.length;
              return (
                <ListItem key={simulado.id} divider button component={RouterLink} to={`/resultado/${simulado.id}`}>
                  <ListItemText 
                    primary={`Simulado #${simulado.id}`}
                    secondary={`Realizado em: ${new Date(simulado.data_criacao).toLocaleDateString('pt-BR')} - Pontuação: ${acertos} de ${total}`}
                  />
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Typography>Você ainda não completou nenhum simulado.</Typography>
        )}
      </Box>
    </Container>
  );
}

export default DashboardPage;