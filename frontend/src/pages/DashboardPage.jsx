import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosInstance';
import { Container, Typography, Box, CircularProgress, Paper, Grid, Divider, List, ListItem, ListItemText } from '@mui/material';
import GraficoDesempenho from '../components/GraficoDesempenho';
import GraficoRadar from '../components/GraficoRadar';

const todasAsMaterias = ['matematica', 'portugues', 'historia', 'geografia', 'fisica', 'quimica', 'biologia'];

const StatCard = ({ title, value }) => (
  <Paper elevation={3} sx={{ p: 2, textAlign: 'center', height: '100%' }}>
    <Typography variant="subtitle1" color="text.secondary">{title}</Typography>
    <Typography variant="h4" component="p" fontWeight="bold">{value}</Typography>
  </Paper>
);

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [simulados, setSimulados] = useState([]);
  const [stats, setStats] = useState({
    acertoGeral: '0%',
    questoesRespondidas: 0,
    simuladosFeitos: 0,
  });
  const [dadosGraficoBarras, setDadosGraficoBarras] = useState(null);
  const [dadosRadarEnem, setDadosRadarEnem] = useState(null);
  const [dadosRadarPersonalizado, setDadosRadarPersonalizado] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    apiClient.get('/meus-simulados/')
      .then(response => {
        const simuladosData = response.data;
        setSimulados(simuladosData);

        if (simuladosData && simuladosData.length > 0) {

          let totalAcertos = 0;
          let totalQuestoes = 0;
          simuladosData.forEach(s => {
            totalAcertos += s.respostas.filter(r => r.correta).length;
            totalQuestoes += s.questoes.length;
          });
          setStats({
            acertoGeral: totalQuestoes > 0 ? `${Math.round((totalAcertos / totalQuestoes) * 100)}%` : '0%',
            questoesRespondidas: totalQuestoes,
            simuladosFeitos: simuladosData.length,
          });

          const processarDadosBarras = (sims) => {
            const estatisticas = {};
            todasAsMaterias.forEach(m => { estatisticas[m] = { total: 0, acertos: 0 } });
            sims.forEach(sim => sim.questoes.forEach(q => {
                const r = sim.respostas.find(res => res.questao_id === q.id);
                estatisticas[q.materia].total++;
                if (r?.correta) estatisticas[q.materia].acertos++;
            }));
            const filtradas = Object.entries(estatisticas).filter(([_,d]) => d.total > 0);
            return {
                labels: filtradas.map(([m,_])=>m.charAt(0).toUpperCase()+m.slice(1)),
                datasets: [{ label: '% de Acerto', data: filtradas.map(([_,d])=>(d.acertos/d.total)*100), backgroundColor: 'rgba(76, 175, 76, 0.5)' }]
            };
          };
          setDadosGraficoBarras(processarDadosBarras(simuladosData));
          
          const gerarDadosRadar = (simuladosFiltrados, cor) => {
            if (simuladosFiltrados.length === 0) return null;
            const estatisticas = {};
            todasAsMaterias.forEach(m => { estatisticas[m] = { total: 0, acertos: 0 } });
            simuladosFiltrados.forEach(sim => sim.questoes.forEach(q => {
                const r = sim.respostas.find(res => res.questao_id === q.id);
                estatisticas[q.materia].total++;
                if (r?.correta) estatisticas[q.materia].acertos++;
            }));
            return {
                labels: todasAsMaterias.map(m=>m.charAt(0).toUpperCase()+m.slice(1)),
                datasets: [{ label: '% de Acerto', data: todasAsMaterias.map(m=>{const e=estatisticas[m];return e.total>0?(e.acertos/e.total)*100:0}), backgroundColor: `rgba(${cor}, 0.2)`, borderColor: `rgb(${cor})`, borderWidth: 1 }]
            };
          };
          setDadosRadarEnem(gerarDadosRadar(simuladosData.filter(s => s.tipo === 'ENEM'), '76, 175, 76')); // Verde
          setDadosRadarPersonalizado(gerarDadosRadar(simuladosData.filter(s => s.tipo === 'PERSONALIZADO'), '53, 162, 235')); // Azul
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar dados do dashboard:", error);
        setLoading(false);
        if (error.response?.status === 401) {
            navigate('/login');
        }
      });
  }, [navigate]);

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>Meu Dashboard</Typography>
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}><StatCard title="Acerto Geral" value={stats.acertoGeral} /></Grid>
          <Grid item xs={12} sm={4}><StatCard title="Questões Respondidas" value={stats.questoesRespondidas} /></Grid>
          <Grid item xs={12} sm={4}><StatCard title="Simulados Feitos" value={stats.simuladosFeitos} /></Grid>
        </Grid>
        
        {dadosGraficoBarras && (
          <Paper sx={{ p: 2, mb: 4 }}>
            <GraficoDesempenho dadosDoGrafico={dadosGraficoBarras} />
          </Paper>
        )}
        
        {(dadosRadarEnem || dadosRadarPersonalizado) && (
          <>
            <Typography variant="h5" component="h2" gutterBottom>Análise Comparativa por Modo</Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {dadosRadarEnem && (
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}><GraficoRadar dadosDoGrafico={dadosRadarEnem} title="Desempenho - Modo ENEM" /></Paper>
                </Grid>
              )}
              {dadosRadarPersonalizado && (
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}><GraficoRadar dadosDoGrafico={dadosRadarPersonalizado} title="Desempenho - Modo Personalizado" /></Paper>
                </Grid>
              )}
            </Grid>
          </>
        )}
        
        <Divider sx={{ mb: 4 }} />
        
        <Typography variant="h5" component="h2" gutterBottom>Histórico de Simulados</Typography>
        {simulados.length > 0 ? (
          <List component={Paper}>
            {simulados.map(simulado => {
              const acertos = simulado.respostas.filter(r => r.correta).length;
              const total = simulado.questoes.length;
              return (
                <ListItem key={simulado.id} divider button component={RouterLink} to={`/resultado/${simulado.id}`} state={{ from: '/dashboard' }}>
                  <ListItemText 
                    primary={`Simulado #${simulado.id} (${simulado.tipo})`}
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