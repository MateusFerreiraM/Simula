// src/components/RootRedirect.jsx

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RootRedirect() {
  const navigate = useNavigate();

  // useEffect vai rodar uma única vez quando o componente for montado
  useEffect(() => {
    // Verifica se o usuário tem um token de acesso
    const token = localStorage.getItem('access_token');

    if (token) {
      // Se tiver, navega para o dashboard
      navigate('/home');
    } else {
      // Se não tiver, navega para a página de login
      navigate('/login');
    }
  }, [navigate]); // O array de dependências garante que o efeito rode apenas uma vez

  // Este componente não renderiza nada visível
  return null;
}

export default RootRedirect;