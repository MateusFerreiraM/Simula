// src/pages/SimuladoPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Box, CircularProgress, Card, CardContent, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button } from '@mui/material';

function SimuladoPage() {
  // O hook useParams nos dá acesso aos parâmetros da URL. Ex: o '1' de '/simulado/1'
  const { simuladoId } = useParams();

  const [simulado, setSimulado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [indiceQuestaoAtual, setIndiceQuestaoAtual] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState('');

  useEffect(() => {
    // Busca os dados do simulado específico na nossa nova API
    axios.get(`http://127.0.0.1:8000/api/simulados/${simuladoId}/`)
      .then(response => {
        setSimulado(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar o simulado:", error);
        setLoading(false);
      });
  }, [simuladoId]); // O useEffect roda novamente se o simuladoId mudar

  if (loading) {
    return <CircularProgress />;
  }

  if (!simulado) {
    return <Typography>Simulado não encontrado.</Typography>;
  }

  const questaoAtual = simulado.questoes[indiceQuestaoAtual];

  const handleProximaQuestao = () => {
      // Lógica para ir para a próxima questão (faremos isso no próximo passo)
      alert(`Você respondeu: ${respostaSelecionada}`);
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>Simulado em Andamento</Typography>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" component="h2">
              Questão {indiceQuestaoAtual + 1} de {simulado.questoes.length}
            </Typography>
            <Typography sx={{ my: 2 }}>{questaoAtual.texto}</Typography>

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
                Próxima Questão
            </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default SimuladoPage;