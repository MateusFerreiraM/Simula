// src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosInstance';
import { Container, Typography, Box, CircularProgress, List, ListItem, ListItemText, Button, Paper } from '@mui/material';
import GraficoDesempenho from '../components/GraficoDesempenho';

function DashboardPage() {
  const [simulados, setSimulados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dadosGrafico, setDadosGrafico] = useState(null);
  const navigate = useNavigate();

  // 2. Crie a função para processar os dados para o gráfico
  const processarDadosParaGrafico = (simulados) => {
    const estatisticas = {}; // Ex: { matematica: { total: 10, acertos: 5 } }

    simulados.forEach(simulado => {
      simulado.questoes.forEach(questao => {
        const materia = questao.materia;
        if (!estatisticas[materia]) {
          estatisticas[materia] = { total: 0, acertos: 0 };
        }

        const respostaCorrespondente = simulado.respostas.find(r => r.questao_id === questao.id);

        estatisticas[materia].total += 1;
        if (respostaCorrespondente?.correta) {
          estatisticas[materia].acertos += 1;
        }
      });
    });

    const labels = Object.keys(estatisticas).map(m => m.charAt(0).toUpperCase() + m.slice(1));
    const data = Object.values(estatisticas).map(est => (est.acertos / est.total) * 100);

    return {
      labels,
      datasets: [
        {
          label: '% de Acerto',
          data,
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
      ],
    };
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      // Se não houver token, redireciona para a página de login
      navigate('/login');
      return; // Para a execução do useEffect
    }

    apiClient.get('/meus-simulados/')
      .then(response => {
        setSimulados(response.data);
        // 3. Chame a função de processamento e guarde os dados no estado
        if (response.data.length > 0) {
          const dadosProcessados = processarDadosParaGrafico(response.data);
          setDadosGrafico(dadosProcessados);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar histórico de simulados:", error);
        // TODO: Tratar erros como token expirado (ex: redirecionar para login)
        setLoading(false);
      });
  }, [navigate]); // Adicione navigate às dependências do useEffect

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Meu Dashboard
        </Typography>

        {/* 4. Renderize o gráfico se houver dados */}
        {dadosGrafico && (
          <Paper sx={{ p: 2, mb: 4 }}>
            <GraficoDesempenho dadosDoGrafico={dadosGrafico} />
          </Paper>
        )}

        <Typography variant="h5" component="h2" gutterBottom>
          Histórico de Simulados
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