import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import apiClient from '../api/axiosInstance';
import { Container, Typography, Box, TextField, Button } from '@mui/material';
import Logo from '../components/Logo';

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
    apiClient.post('/auth/users/', formData)
      .then(response => {
        alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
        navigate('/login');
      })
      .catch(error => {
        const errorData = error.response?.data || {};
        const errorMessages = Object.keys(errorData).map(key => `${key}: ${errorData[key].join(', ')}`).join('\n');
        alert(`Erro no cadastro:\n${errorMessages || 'Ocorreu um problema.'}`);
      });
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Logo height={250} />
          <Typography variant="h4" sx={{ color: 'green', fontWeight: 'bold'}}>
            O seu site de estudos!
          </Typography>
        </Box>
        <Typography variant="h4" component="h1">Cadastro</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth label="Nome de Usuário" name="username" value={formData.username} onChange={handleChange} autoFocus />
          <TextField margin="normal" required fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
          <TextField margin="normal" required fullWidth label="Senha" name="password" type="password" value={formData.password} onChange={handleChange} />
          <TextField margin="normal" required fullWidth label="Confirme a Senha" name="re_password" type="password" value={formData.re_password} onChange={handleChange} />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Cadastrar
          </Button>
          
          <Typography variant="body2" align="center">
            Já tem uma conta?{' '}
            <RouterLink to="/login" style={{ color: 'inherit', fontWeight: 'bold' }}>
              Faça login
            </RouterLink>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default RegisterPage;