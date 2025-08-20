import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosInstance';
import { Container, Typography, Box, FormGroup, FormControlLabel, Checkbox, TextField, Button, FormControl, FormLabel, RadioGroup, Radio, Alert, AlertTitle } from '@mui/material';

const materiasDisponiveis = [
  'matematica', 'portugues', 'historia', 'geografia', 'fisica', 'quimica', 'biologia'
];

function CustomTestPage() {
  const navigate = useNavigate();
  const [materiasSelecionadas, setMateriasSelecionadas] = useState({});
  const [numQuestoes, setNumQuestoes] = useState(10);
  const [dificuldade, setDificuldade] = useState("");
  const [modoNumeroQuestoes, setModoNumeroQuestoes] = useState('total');

  const handleCheckboxChange = (event) => {
    setMateriasSelecionadas({ ...materiasSelecionadas, [event.target.name]: event.target.checked });
  };

  const handleNumQuestoesChange = useCallback((e) => {
    const value = e.target.value;
    if (value === '') {
      setNumQuestoes('');
    } else {
      const intValue = parseInt(value, 10);
      if (!isNaN(intValue) && intValue >= 0) {
        setNumQuestoes(intValue);
      }
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const selecionadas = Object.keys(materiasSelecionadas).filter(materia => materiasSelecionadas[materia]);

    if (selecionadas.length === 0) {
      alert("Por favor, selecione pelo menos uma matéria.");
      return;
    }

    const configData = {
      materias: selecionadas,
      num_questoes: parseInt(numQuestoes, 10),
      modo_numero_questoes: modoNumeroQuestoes,
    };

    if (dificuldade) {
      configData.dificuldade = dificuldade;
    }

    apiClient.post('/gerar-simulado/', configData)
      .then(response => {
        navigate(`/simulado/${response.data.id}`);
      })
      .catch(error => {
        console.error("Erro ao criar o simulado:", error.response?.data);
        alert(`Erro: ${error.response?.data?.erro || 'Ocorreu um problema.'}`);
      });
  };

  return (
    <Container maxWidth="md">
      <Box component="form" onSubmit={handleSubmit} sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Personalize seu Teste
        </Typography>

        <Alert severity="info" sx={{ mt: 2, mb: 3 }}>
          <AlertTitle>Informação Importante</AlertTitle>
          Para esta versão de demonstração, o nosso banco de dados contém <strong>3 questões</strong> para cada combinação de matéria e dificuldade.
        </Alert>

        <FormControl component="fieldset" variant="standard" sx={{ my: 3, width: '100%' }}>
          <FormLabel component="legend">Escolha as matérias</FormLabel>
          <FormGroup row>
            {materiasDisponiveis.map((materia) => (
              <FormControlLabel
                key={materia}
                control={<Checkbox checked={materiasSelecionadas[materia] || false} onChange={handleCheckboxChange} name={materia} />}
                label={materia.charAt(0).toUpperCase() + materia.slice(1)}
              />
            ))}
          </FormGroup>
        </FormControl>
        
        <FormControl component="fieldset" variant="standard" sx={{ my: 3, width: '100%' }}>
          <FormLabel component="legend">Escolha a dificuldade</FormLabel>
          <RadioGroup row value={dificuldade} onChange={(e) => setDificuldade(e.target.value)}>
            <FormControlLabel value="" control={<Radio />} label="Todas" />
            <FormControlLabel value="F" control={<Radio />} label="Fácil" />
            <FormControlLabel value="M" control={<Radio />} label="Médio" />
            <FormControlLabel value="D" control={<Radio />} label="Difícil" />
          </RadioGroup>
        </FormControl>

        <FormControl component="fieldset" variant="standard" sx={{ my: 3, width: '100%' }}>
          <FormLabel component="legend">O número de questões refere-se ao...</FormLabel>
          <RadioGroup row value={modoNumeroQuestoes} onChange={(e) => setModoNumeroQuestoes(e.target.value)}>
            <FormControlLabel value="total" control={<Radio />} label="Número Total de Questões" />
            <FormControlLabel value="por_materia" control={<Radio />} label="Número de Questões por Matéria" />
          </RadioGroup>
        </FormControl>

        <Box sx={{ my: 3 }}>
          <TextField
            fullWidth
            label="Número de Questões"
            type="number"
            value={numQuestoes}
            onChange={handleNumQuestoesChange}
            InputProps={{ inputProps: { min: 1, step: 1 } }}
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        <Button type="submit" variant="contained" size="large">
          Iniciar Teste
        </Button>
      </Box>
    </Container>
  );
}

export default CustomTestPage;