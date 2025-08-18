import axios from 'axios';

// Cria uma instância do Axios com configurações pré-definidas.
const apiClient = axios.create({
  // Lê a URL base da API a partir das variáveis de ambiente do Vite.
  // Se a variável não existir (no ambiente local), usa o localhost como padrão.
  baseURL: `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/api`,
});

// Adiciona um interceptador que anexa o token de autenticação em cada requisição.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;