import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import apiClient from '../api/axiosInstance';
import { Container, Typography, Box, CircularProgress, Card, CardContent, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, Chip } from '@mui/material';

const formatarTempo = (segundos) => {
  if (segundos < 0) return "00:00";
  const minutos = Math.floor(segundos / 60);
  const segs = segundos % 60;
  return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
};

function SimuladoPage() {
  const { simuladoId } = useParams();
  const navigate = useNavigate();

  const [simulado, setSimulado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [indiceQuestaoAtual, setIndiceQuestaoAtual] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState('');
  const [tempoRestante, setTempoRestante] = useState(null);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    apiClient.get(`/simulados/${simuladoId}/`)
      .then(response => {
        setSimulado(response.data);
        const tempoTotalEmSegundos = response.data.questoes.length * 180;
        setTempoRestante(tempoTotalEmSegundos);
        setStartTime(Date.now());
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar o simulado:", error);
        setLoading(false);
      });
  }, [simuladoId]);

  const finalizarSimulado = () => {
    const endTime = Date.now();
    const duracaoEmSegundos = Math.round((endTime - startTime) / 1000);

    apiClient.post(`/simulados/${simuladoId}/finalizar/`, { tempo_levado: duracaoEmSegundos })
        .then(() => {
            navigate(`/resultado/${simuladoId}`);
        })
        .catch(error => {
            console.error("Erro ao finalizar o simulado:", error);
            alert("Houve um erro ao finalizar seu simulado.");
        });
  };

  useEffect(() => {
    if (tempoRestante === null) return;
    if (tempoRestante <= 0) {
      if(startTime) { // Evita o alerta na primeira renderização
          alert('O tempo acabou!');
          finalizarSimulado();
      }
      return;
    };
    const timerId = setInterval(() => setTempoRestante(t => t - 1), 1000);
    return () => clearInterval(timerId);
  }, [tempoRestante, navigate, simuladoId, startTime]);

  const handleProximaQuestao = () => {
    if (!respostaSelecionada) {
      alert('Por favor, selecione uma alternativa.');
      return;
    }
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
        console.error("Erro ao salvar a resposta:", error);
        alert("Não foi possível salvar sua resposta. Tente novamente.");
      });
  };
  
  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
  }

  if (!simulado) {
    return <Typography sx={{ textAlign: 'center', mt: 4 }}>Simulado não encontrado.</Typography>;
  }

  // NOVA VERIFICAÇÃO DE SEGURANÇA
  if (simulado.questoes.length === 0) {
    return (
      <Container sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h5">Erro ao Carregar Simulado</Typography>
        <Typography sx={{ my: 2 }}>
          Este simulado não contém nenhuma questão. Isso pode acontecer se não houver questões suficientes no banco de dados para os filtros que você selecionou.
        </Typography>
        <Button component={RouterLink} to="/home" variant="contained">
          Voltar para o Início
        </Button>
      </Container>
    );
  }
  
  const questaoAtual = simulado.questoes[indiceQuestaoAtual];
  const isUltimaQuestao = indiceQuestaoAtual === simulado.questoes.length - 1;

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">Simulado em Andamento</Typography>
          <Chip label={formatarTempo(tempoRestante)} color="primary" sx={{ fontSize: '1.2rem', padding: '1.2rem' }} />
        </Box>

        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" component="h2">
              Questão {indiceQuestaoAtual + 1} de {simulado.questoes.length}
            </Typography>
            <Typography sx={{ my: 2 }}>{questaoAtual.texto}</Typography>
            {questaoAtual.imagem && (
              <Box sx={{ my: 2, textAlign: 'center' }}>
                <Box
                  component="img"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    borderRadius: '8px',
                  }}
                  alt={`Imagem para a questão ${questaoAtual.id}`}
                  src={questaoAtual.imagem}
                />
              </Box>
            )}
            <FormControl component="fieldset">
              <FormLabel component="legend">Alternativas</FormLabel>
              <RadioGroup
                value={respostaSelecionada}
                onChange={(e) => setRespostaSelecionada(e.target.value)}
              >
                <FormControlLabel value="A" control={<Radio />} label={`A) ${questaoAtual.alternativa_a}`} />
                <FormControlLabel value="B" control={<Radio />} label={`B) ${questaoAtual.alternativa_b}`} />
                <FormControlLabel value="C" control={<Radio />} label={`C) ${questaoAtual.alternativa_c}`} />
                <FormControlLabel value="D" control={<Radio />} label={`D) ${questaoAtual.alternativa_d}`} />
                <FormControlLabel value="E" control={<Radio />} label={`E) ${questaoAtual.alternativa_e}`} />
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={handleProximaQuestao}>
                {isUltimaQuestao ? 'Finalizar Simulado' : 'Próxima Questão'}
            </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default SimuladoPage;