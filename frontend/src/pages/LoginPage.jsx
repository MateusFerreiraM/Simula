import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import apiClient from '../api/axiosInstance';
import { Container, Typography, Box, TextField, Button } from '@mui/material';
import Logo from '../components/Logo';

/**
 * Página de login de usuários, agora com visual customizado.
 */
function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  useEffect(() => {
    // Este código executa uma vez quando a página de login carrega.
    // Ele garante que, ao chegar aqui, qualquer sessão anterior seja encerrada.
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }, []);

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
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Logo height={250} />
          <Typography variant="h4" sx={{ color: 'green', fontWeight: 'bold'}}>
            O seu site de estudos!
          </Typography>
        </Box>

        <Typography variant="h4" component="h1">Login</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField margin="normal" required fullWidth label="Nome de Usuário" name="username" value={formData.username} onChange={handleChange} autoFocus />
          <TextField margin="normal" required fullWidth label="Senha" name="password" type="password" value={formData.password} onChange={handleChange} />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Entrar
          </Button>
          
          <Typography variant="body2" align="center">
            Não tem uma conta?{' '}
            <RouterLink to="/cadastro" style={{ color: 'inherit', fontWeight: 'bold' }}>
              Cadastre-se
            </RouterLink>
          </Typography>
          
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;