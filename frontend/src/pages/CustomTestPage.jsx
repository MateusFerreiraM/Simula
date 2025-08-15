// src/pages/CustomTestPage.jsx

import React, { useState } from 'react';
import { Container, Typography, Box, FormGroup, FormControlLabel, Checkbox, TextField, Button, FormControl, FormLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Lista de matérias disponíveis. No futuro, podemos buscar isso da API.
const materiasDisponiveis = [
  'matematica', 'portugues', 'historia', 'geografia', 'fisica', 'quimica', 'biologia'
];

function CustomTestPage() {
  // 2. Inicialize o hook de navegação
  const navigate = useNavigate();

  const [materiasSelecionadas, setMateriasSelecionadas] = useState({});
  const [numQuestoes, setNumQuestoes] = useState(10);

  // Função para lidar com a mudança nos checkboxes
  const handleCheckboxChange = (event) => {
    setMateriasSelecionadas({
      ...materiasSelecionadas,
      [event.target.name]: event.target.checked,
    });
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = (event) => {
    event.preventDefault();
    // Filtra apenas as matérias que estão marcadas como 'true'
    const selecionadas = Object.keys(materiasSelecionadas).filter(materia => materiasSelecionadas[materia]);

    if (selecionadas.length === 0) {
      alert("Por favor, selecione pelo menos uma matéria.");
      return;
    }

    // Os dados que enviaremos para a API
    const configData = {
      materias: selecionadas,
      num_questoes: parseInt(numQuestoes, 10), // Garante que é um número
    };

    // Chamada para a nova API usando POST
    axios.post('http://127.0.0.1:8000/api/gerar-simulado/', configData)
      .then(response => {
        console.log("Simulado criado:", response.data);
        const simuladoId = response.data.id;
        // Navega para a página do simulado (que criaremos em seguida)
        navigate(`/simulado/${simuladoId}`);
      })
      .catch(error => {
        console.error("Erro ao criar o simulado:", error.response.data);
        alert(`Erro: ${error.response.data.erro}`);
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