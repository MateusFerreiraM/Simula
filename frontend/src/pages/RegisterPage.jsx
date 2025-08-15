// src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Box, TextField, Button } from '@mui/material';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    re_password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/auth/users/', formData)
      .then(response => {
        console.log("Usuário criado:", response.data);
        alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
        navigate('/login');
      })
      .catch(error => {
        console.error('Erro no cadastro:', error.response.data);
        // Transforma os erros da API em uma string para exibir no alerta
        const errorData = error.response.data;
        const errorMessages = Object.keys(errorData).map(key => `${key}: ${errorData[key].join(', ')}`).join('\n');
        alert(`Erro no cadastro:\n${errorMessages}`);
      });
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">Cadastro</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth label="Nome de Usuário" name="username" value={formData.username} onChange={handleChange} autoFocus />
          <TextField margin="normal" required fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
          <TextField margin="normal" required fullWidth label="Senha" name="password" type="password" value={formData.password} onChange={handleChange} />
          <TextField margin="normal" required fullWidth label="Confirme a Senha" name="re_password" type="password" value={formData.re_password} onChange={handleChange} />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Cadastrar
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default RegisterPage;