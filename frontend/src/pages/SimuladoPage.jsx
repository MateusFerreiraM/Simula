import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import apiClient from '../api/axiosInstance';
import { Container, Typography, Box, CircularProgress, Card, CardContent, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, Chip } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

/**
 * Formata um número total de segundos para o formato de string MM:SS.
 */
const formatarTempo = (segundos) => {
    if (segundos === null || segundos < 0) return "00:00";
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
};

/**
 * Página principal do simulado, opera em dois modos:
 * 1. Modo Teste: O usuário responde às questões contra o tempo.
 * 2. Modo Revisão: O usuário revisa uma prova já concluída, vendo suas respostas e as corretas.
 */
function SimuladoPage() {
  const { simuladoId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Determina o modo de operação (Teste ou Revisão) a partir do state da rota.
  const reviewMode = location.state?.reviewMode || false;

  // Estados do componente
  const [simulado, setSimulado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [indiceQuestaoAtual, setIndiceQuestaoAtual] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState('');
  const [tempoRestante, setTempoRestante] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [mapaRespostas, setMapaRespostas] = useState({});

  // Efeito para buscar os dados do simulado da API.
  useEffect(() => {
    apiClient.get(`/simulados/${simuladoId}/`)
      .then(response => {
        const simuladoData = response.data;
        setSimulado(simuladoData);

        if (!reviewMode) {
          const tempoTotalEmSegundos = simuladoData.questoes.length * 180; // 3 min por questão
          setTempoRestante(tempoTotalEmSegundos);
          setEndTime(Date.now() + tempoTotalEmSegundos * 1000);
          localStorage.setItem('simulado_start_time', Date.now());
        }

        const respostasMap = simuladoData.respostas.reduce((map, resp) => {
            map[resp.questao_id] = resp.resposta_usuario;
            return map;
        }, {});
        setMapaRespostas(respostasMap);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar o simulado:", error);
        setLoading(false);
      });
  }, [simuladoId, reviewMode]);

  // Efeito que controla o cronômetro.
  useEffect(() => {
    if (reviewMode || !endTime) return;

    const timerId = setInterval(() => {
      const segundosRestantes = Math.round((endTime - Date.now()) / 1000);
      setTempoRestante(segundosRestantes);

      if (segundosRestantes <= 0) {
        clearInterval(timerId);
        alert('O tempo acabou!');
        finalizarSimulado();
      }
    }, 1000);
    return () => clearInterval(timerId);
  }, [endTime, reviewMode, navigate, simuladoId]);

  /**
   * Chamado quando o simulado termina, seja pelo tempo ou pelo usuário.
   * Calcula a duração e envia para o backend antes de navegar para a página de resultados.
   */
  const finalizarSimulado = () => {
    const startTimeFromStorage = localStorage.getItem('simulado_start_time');
    const duracaoEmSegundos = Math.round((Date.now() - startTimeFromStorage) / 1000);

    apiClient.post(`/simulados/${simuladoId}/finalizar/`, { tempo_levado: duracaoEmSegundos })
        .then(() => navigate(`/resultado/${simuladoId}`))
        .catch(error => {
            console.error("Erro ao finalizar o simulado:", error);
            alert("Houve um erro ao finalizar seu simulado.");
        });
  };

  /**
   * Lida com o envio da resposta do usuário e avança para a próxima questão ou finaliza o simulado.
   */
  const handleProximaQuestao = () => {
    if (!respostaSelecionada) {
      alert('Por favor, selecione uma alternativa.');
      return;
    }
    const questaoAtual = simulado.questoes[indiceQuestaoAtual];
    const dadosResposta = {
      simulado_id: simulado.id,
      questao_id: questaoAtual.id,
      resposta_usuario: respostaSelecionada,
    };
    
    apiClient.post('/salvar-resposta/', dadosResposta)
      .then(() => {
        if (indiceQuestaoAtual < simulado.questoes.length - 1) {
          setIndiceQuestaoAtual(indiceQuestaoAtual + 1);
          setRespostaSelecionada('');
        } else {
          finalizarSimulado();
        }
      })
      .catch(error => {
        console.error("Erro ao salvar a resposta:", error.response);
        alert("Não foi possível salvar sua resposta. Tente novamente.");
      });
  };

  /**
   * Controla a navegação para frente e para trás no modo de revisão.
   */
  const handleNavegacaoRevisao = (direcao) => {
      const novoIndice = indiceQuestaoAtual + direcao;
      if (novoIndice >= 0 && novoIndice < simulado.questoes.length) {
          setIndiceQuestaoAtual(novoIndice);
      }
  };

  // --- Renderização do Componente ---

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
  }

  if (!simulado) {
    return <Typography sx={{ textAlign: 'center', mt: 4 }}>Simulado não encontrado.</Typography>;
  }

  if (!reviewMode && simulado.questoes.length === 0) {
    return (
      <Container sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h5">Erro ao Carregar Simulado</Typography>
        <Typography sx={{ my: 2 }}>
          Este simulado não contém nenhuma questão.
        </Typography>
        <Button component={RouterLink} to="/home" variant="contained">
          Voltar para o Início
        </Button>
      </Container>
    );
  }
  
  const questaoAtual = simulado.questoes[indiceQuestaoAtual];
  if (!questaoAtual) {
    return <Typography sx={{ textAlign: 'center', mt: 4 }}>Erro: Não foi possível carregar a questão atual.</Typography>;
  }
  const isUltimaQuestao = indiceQuestaoAtual === simulado.questoes.length - 1;
  const respostaDoUsuarioParaQuestaoAtual = mapaRespostas[questaoAtual.id];

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">
            {reviewMode ? 'Revisão do Simulado' : 'Simulado em Andamento'}
          </Typography>
          {!reviewMode && <Chip label={formatarTempo(tempoRestante)} color="primary" sx={{ fontSize: '1.2rem' }} />}
        </Box>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" component="h2">Questão {indiceQuestaoAtual + 1} de {simulado.questoes.length}</Typography>
            <Typography sx={{ my: 2 }}>{questaoAtual.texto}</Typography>
            {questaoAtual.imagem && (
              <Box sx={{ my: 2, textAlign: 'center' }}>
                <Box component="img" sx={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }} alt={`Imagem para a questão ${questaoAtual.id}`} src={questaoAtual.imagem}/>
              </Box>
            )}
            <FormControl component="fieldset" disabled={reviewMode}>
              <FormLabel component="legend">Alternativas</FormLabel>
              <RadioGroup value={reviewMode ? respostaDoUsuarioParaQuestaoAtual || '' : respostaSelecionada} onChange={(e) => setRespostaSelecionada(e.target.value)}>
                {['a', 'b', 'c', 'd', 'e'].map(alt => {
                    const altKey = `alternativa_${alt}`;
                    const altValue = alt.toUpperCase();
                    let labelStyle = {};
                    if (reviewMode) {
                        if (altValue === questaoAtual.resposta_correta) {
                            labelStyle = { color: 'green', fontWeight: 'bold' };
                        } else if (altValue === respostaDoUsuarioParaQuestaoAtual) {
                            labelStyle = { color: 'red' };
                        }
                    }
                    return (
                        <FormControlLabel
                            key={altKey}
                            value={altValue}
                            control={<Radio />}
                            label={
                                <Typography component="span" sx={labelStyle}>
                                    {`${altValue}) ${questaoAtual[altKey]}`}
                                </Typography>
                            }
                        />
                    );
                })}
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {reviewMode ? (
            <>
              <Button variant="outlined" startIcon={<ArrowBackIosNewIcon />} onClick={() => handleNavegacaoRevisao(-1)} disabled={indiceQuestaoAtual === 0}>Anterior</Button>
              <Typography>{indiceQuestaoAtual + 1} / {simulado.questoes.length}</Typography>
              <Button variant="outlined" endIcon={<ArrowForwardIosIcon />} onClick={() => handleNavegacaoRevisao(1)} disabled={isUltimaQuestao}>Próxima</Button>
            </>
          ) : (
            <Button variant="contained" onClick={handleProximaQuestao} sx={{ ml: 'auto' }}>
                {isUltimaQuestao ? 'Finalizar Simulado' : 'Próxima Questão'}
            </Button>
          )}
        </Box>
        {reviewMode && (
            <Box sx={{mt: 2, display: 'flex', justifyContent: 'center'}}>
                <Button component={RouterLink} to="/dashboard" variant="contained">Voltar para o Histórico</Button>
            </Box>
        )}
      </Box>
    </Container>
  );
}

export default SimuladoPage;