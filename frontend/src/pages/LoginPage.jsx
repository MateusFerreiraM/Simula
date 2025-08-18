import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosInstance';
import { Container, Typography, Box, TextField, Button } from '@mui/material';

/**
 * Página de login de usuários.
 */
function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    apiClient.post('/auth/jwt/create/', formData)
      .then(response => {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        navigate('/home');
      })
      .catch(error => {
        console.error('Erro no login:', error);
        alert('Erro no login. Verifique seu usuário e senha.');
      });
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">Login</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth label="Nome de Usuário" name="username" value={formData.username} onChange={handleChange} autoFocus />
          <TextField margin="normal" required fullWidth label="Senha" name="password" type="password" value={formData.password} onChange={handleChange} />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Entrar
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;