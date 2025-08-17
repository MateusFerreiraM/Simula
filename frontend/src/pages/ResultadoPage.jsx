// src/pages/ResultadoPage.jsx (Arquivo Completo com todas as melhorias)
import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink, useLocation } from 'react-router-dom';
import apiClient from '../api/axiosInstance';
import { Container, Typography, Box, CircularProgress, List, ListItem, ListItemText, ListItemIcon, Button, Paper, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const formatarDuracao = (segundos) => {
    if (isNaN(segundos) || segundos < 0) return null;
    const minutos = Math.floor(segundos / 60);
    const segs = Math.floor(segundos % 60);
    return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
}

function ResultadoPage() {
  const { simuladoId } = useParams();
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const veioDoDashboard = location.state?.from === '/dashboard';

  useEffect(() => {
    apiClient.get(`/simulados/${simuladoId}/`)
      .then(response => {
        setResultado(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar resultado do simulado:", error);
        setLoading(false);
      });
  }, [simuladoId]);

  if (loading) return <CircularProgress />;
  if (!resultado) return <Typography>Resultado não encontrado.</Typography>;

  const acertos = resultado.respostas.filter(r => r.correta).length;
  const totalQuestoes = resultado.questoes.length;
  const tempoFormatado = formatarDuracao(resultado.tempo_levado);

  const mapaRespostas = resultado.respostas.reduce((map, resp) => {
      map[resp.questao_id] = resp;
      return map;
  }, {});

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Resultado do Simulado
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
            <Chip label={`Pontuação: ${acertos} de ${totalQuestoes}`} color="primary" />
            {tempoFormatado && <Chip label={`Tempo: ${tempoFormatado}`} color="secondary" />}
        </Box>

        <List component={Paper}>
          {resultado.questoes.map((questao, index) => {
            const respostaDoUsuario = mapaRespostas[questao.id];
            const acertou = respostaDoUsuario?.correta || false;
            const nomeMateria = questao.materia.charAt(0).toUpperCase() + questao.materia.slice(1);

            return (
              <ListItem key={questao.id} divider sx={{ alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ mt: 1.5 }}>
                  {acertou ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
                </ListItemIcon>
                <ListItemText
                  primary={`${index + 1}. ${questao.texto}`}
                  secondary={
                    <React.Fragment>
                      {questao.imagem && (
                        <Box
                          component="img"
                          sx={{
                            maxWidth: '200px',
                            maxHeight: '150px',
                            borderRadius: '4px',
                            mt: 1,
                          }}
                          alt={`Imagem para a questão ${questao.id}`}
                          src={questao.imagem}
                        />
                      )}
                      <Typography component="span" variant="body2" color="text.secondary" display="block">
                        Matéria: {nomeMateria}
                      </Typography>
                      <Typography component="span" variant="body2" color="text.secondary">
                        Sua resposta: {respostaDoUsuario?.resposta_usuario || "Não respondida"} 
                      <br />
                      Resposta correta: {questao.resposta_correta}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
            );
          })}
        </List>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          {/* O botão 'Voltar' ou 'Fazer Novo Simulado' */}
          <Button 
            variant="outlined" // Sugestão: Mudar para 'outlined' para dar destaque ao outro botão
            component={RouterLink} 
            to={veioDoDashboard ? '/dashboard' : '/home'}
          >
            {veioDoDashboard ? 'Voltar para o Histórico' : 'Fazer Novo Simulado'}
          </Button>

          {/* O botão 'Revisar Prova' */}
          <Button 
            variant="contained" 
            component={RouterLink} 
            to={`/simulado/${resultado.id}`}
            state={{ reviewMode: true }}
          >
            Revisar Prova
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
export default ResultadoPage;