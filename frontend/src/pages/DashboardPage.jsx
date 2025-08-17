// src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosInstance';
import { Container, Typography, Box, CircularProgress, List, ListItem, ListItemText, Button, Paper } from '@mui/material';
import GraficoDesempenho from '../components/GraficoDesempenho';

// NOVO: Lista de todas as matérias possíveis no nosso sistema
const todasAsMaterias = ['matematica', 'portugues', 'historia', 'geografia', 'fisica', 'quimica', 'biologia'];

function DashboardPage() {
  const [simulados, setSimulados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dadosGrafico, setDadosGrafico] = useState(null);
  const navigate = useNavigate();

  // LÓGICA ALTERADA: Esta função agora é mais inteligente
  const processarDadosParaGrafico = (simulados) => {
    const estatisticas = {};
    // 1. Inicia o placar para todas as matérias com zero
    todasAsMaterias.forEach(materia => {
      estatisticas[materia] = { total: 0, acertos: 0 };
    });

    // 2. Preenche o placar com os dados do histórico do usuário
    simulados.forEach(simulado => {
      simulado.questoes.forEach(questao => {
        const materia = questao.materia;
        // Garante que a matéria exista no placar (caso novas matérias sejam adicionadas no futuro)
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

    // 3. Filtra apenas as matérias que o usuário já tentou (total > 0)
    const estatisticasFiltradas = Object.entries(estatisticas).filter(([_, data]) => data.total > 0);

    // Se não houver nenhuma estatística para mostrar, retorna nulo
    if (estatisticasFiltradas.length === 0) {
        return null;
    }

    // Capitaliza o nome da matéria para o gráfico
    const labels = estatisticasFiltradas.map(([materia, _]) => materia.charAt(0).toUpperCase() + materia.slice(1));
    const data = estatisticasFiltradas.map(([_, est]) => (est.acertos / est.total) * 100);

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
      navigate('/login');
      return;
    }

    apiClient.get('/meus-simulados/')
      .then(response => {
        setSimulados(response.data);
        // Chama a nova função de processamento
        if (response.data && response.data.length > 0) {
          const dadosProcessados = processarDadosParaGrafico(response.data);
          setDadosGrafico(dadosProcessados);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar histórico de simulados:", error);
        setLoading(false);
        if(error.response?.status === 401){
            navigate('/login');
        }
      });
  }, [navigate]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Meu Dashboard
        </Typography>

        {dadosGrafico ? (
          <Paper sx={{ p: 2, mb: 4 }}>
            <GraficoDesempenho dadosDoGrafico={dadosGrafico} />
          </Paper>
        ) : (
          <Typography sx={{mb: 4}}>Faça um simulado para ver seu gráfico de desempenho!</Typography>
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
                <ListItem key={simulado.id} divider button component={RouterLink} to={`/resultado/${simulado.id}`}state={{ from: '/dashboard' }}>
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