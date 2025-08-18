import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link as RouterLink, useLocation } from 'react-router-dom';
import apiClient from '../api/axiosInstance';
import { Container, Typography, Box, CircularProgress, List, ListItem, ListItemText, ListItemIcon, Button, Paper, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

/**
 * Formata um número total de segundos para o formato MM:SS.
 * @param {number} segundos - O total de segundos.
 * @returns {string|null} A string formatada ou nulo se a entrada for inválida.
 */
const formatarDuracao = (segundos) => {
    if (isNaN(segundos) || segundos === null || segundos < 0) return null;
    const minutos = Math.floor(segundos / 60);
    const segs = Math.floor(segundos % 60);
    return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
}

/**
 * Página que exibe os resultados detalhados de um simulado concluído.
 */
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

  // Otimização: Cálculos são "memorizados" e só rodam novamente se 'resultado' mudar.
  const { acertos, totalQuestoes, tempoFormatado, mapaRespostas } = useMemo(() => {
    if (!resultado) {
      return { acertos: 0, totalQuestoes: 0, tempoFormatado: null, mapaRespostas: {} };
    }
    const acertos = resultado.respostas.filter(r => r.correta).length;
    const totalQuestoes = resultado.questoes.length;
    const tempoFormatado = formatarDuracao(resultado.tempo_levado);
    const mapaRespostas = resultado.respostas.reduce((map, resp) => {
        map[resp.questao_id] = resp;
        return map;
    }, {});
    return { acertos, totalQuestoes, tempoFormatado, mapaRespostas };
  }, [resultado]);

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
  if (!resultado) return <Typography sx={{ textAlign: 'center', mt: 4 }}>Resultado não encontrado.</Typography>;

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
                        <Box component="img" sx={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '4px', mt: 1, }} alt={`Imagem para a questão ${questao.id}`} src={questao.imagem} />
                      )}
                      <Typography component="span" variant="body2" color="text.secondary" display="block">
                        Matéria: {nomeMateria}
                      </Typography>
                      <Typography component="span" variant="body2" color="text.secondary">
                        Sua resposta: {respostaDoUsuario?.resposta_usuario || "Não respondida"}. 
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
          <Button variant="outlined" component={RouterLink} to={veioDoDashboard ? '/dashboard' : '/home'}>
            {veioDoDashboard ? 'Voltar para o Histórico' : 'Fazer Novo Simulado'}
          </Button>
          <Button variant="contained" component={RouterLink} to={`/simulado/${resultado.id}`} state={{ reviewMode: true }}>
            Revisar Prova
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default ResultadoPage;