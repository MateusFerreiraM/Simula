import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Componente "porteiro". Não renderiza nada visual, sua única função é
 * redirecionar o usuário para a rota correta com base no seu estado de login.
 * - Se logado -> /home
 * - Se deslogado -> /login
 */
function RootRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (token) {
      navigate('/home');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return null;
}

export default RootRedirect;