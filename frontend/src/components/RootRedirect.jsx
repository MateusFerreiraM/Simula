import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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