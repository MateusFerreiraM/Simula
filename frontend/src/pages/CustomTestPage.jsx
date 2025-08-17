// src/pages/CustomTestPage.jsx

import React, { useState } from 'react';
import { Container, Typography, Box, FormGroup, FormControlLabel, Checkbox, TextField, Button, FormControl, FormLabel, RadioGroup, Radio } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosInstance';

// Lista de matérias disponíveis. No futuro, podemos buscar isso da API.
const materiasDisponiveis = [
  'matematica', 'portugues', 'historia', 'geografia', 'fisica', 'quimica', 'biologia'
];

function CustomTestPage() {
  const navigate = useNavigate();
  const [materiasSelecionadas, setMateriasSelecionadas] = useState({});
  const [numQuestoes, setNumQuestoes] = useState(10);
  const [dificuldade, setDificuldade] = useState(""); // 1. Novo estado para a dificuldade

  const handleCheckboxChange = (event) => {
    setMateriasSelecionadas({
      ...materiasSelecionadas,
      [event.target.name]: event.target.checked,
    });
  };

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
    };

    // 2. Adiciona a dificuldade ao corpo da requisição APENAS se uma for selecionada
    if (dificuldade) {
      configData.dificuldade = dificuldade;
    }

    apiClient.post('/gerar-simulado/', configData)
      .then(response => {
        const simuladoId = response.data.id;
        navigate(`/simulado/${simuladoId}`);
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

        <FormControl component="fieldset" variant="standard" sx={{ my: 3 }}>
          <FormLabel component="legend">Escolha as matérias</FormLabel>
          <FormGroup>
            {materiasDisponiveis.map((materia) => (
              <FormControlLabel
                key={materia}
                control={
                  <Checkbox 
                    checked={materiasSelecionadas[materia] || false} 
                    onChange={handleCheckboxChange} 
                    name={materia} 
                  />
                }
                // Transforma 'matematica' em 'Matemática' para exibir
                label={materia.charAt(0).toUpperCase() + materia.slice(1)}
              />
            ))}
          </FormGroup>
        </FormControl>
          
        <FormControl component="fieldset" variant="standard" sx={{ my: 3, ml: 5 }}>
          <FormLabel component="legend">Escolha a dificuldade</FormLabel>
          <RadioGroup
            row
            value={dificuldade}
            onChange={(e) => setDificuldade(e.target.value)}
          >
            <FormControlLabel value="" control={<Radio />} label="Todas" />
            <FormControlLabel value="F" control={<Radio />} label="Fácil" />
            <FormControlLabel value="M" control={<Radio />} label="Médio" />
            <FormControlLabel value="D" control={<Radio />} label="Difícil" />
          </RadioGroup>
        </FormControl>

        <Box sx={{ my: 3 }}>
          <TextField
            fullWidth
            label="Número de Questões"
            type="number"
            value={numQuestoes}
            onChange={(e) => setNumQuestoes(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
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