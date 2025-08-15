// src/pages/ResultadoPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Box, CircularProgress, Card, CardContent, List, ListItem, ListItemText, ListItemIcon, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Ícone de certo
import CancelIcon from '@mui/icons-material/Cancel'; // Ícone de errado

function ResultadoPage() {
  const { simuladoId } = useParams();
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/simulados/${simuladoId}/`)
      .then(response => {
        setResultado(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar resultado do simulado:", error);
        setLoading(false);
      });
  }, [simuladoId]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!resultado) {
    return <Typography>Resultado não encontrado.</Typography>;
  }

  // Calcula a pontuação
  const acertos = resultado.respostas.filter(r => r.correta).length;
  const totalQuestoes = resultado.questoes.length;

  // Mapeia as respostas por ID da questão para fácil acesso
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
        <Typography variant="h5" align="center" paragraph>
          Você acertou {acertos} de {totalQuestoes} questões!
        </Typography>

        <List>
          {resultado.questoes.map((questao, index) => {
            const respostaDoUsuario = mapaRespostas[questao.id];
            const acertou = respostaDoUsuario?.correta || false;

            return (
              <ListItem key={questao.id} divider>
                <ListItemIcon>
                  {acertou ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
                </ListItemIcon>
                <ListItemText
                  primary={`${index + 1}. ${questao.texto}`}
                  secondary={
                    <>
                      Sua resposta: {respostaDoUsuario?.resposta_usuario || "Não respondida"}. 
                      <br />
                      Resposta correta: {questao.resposta_correta}
                    </>
                  }
                />
              </ListItem>
            );
          })}
        </List>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" component={RouterLink} to="/">
                Voltar para o Início
            </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default ResultadoPage;