// src/api/axiosInstance.js

import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // A base da nossa URL da API
});

// Este é o interceptador. É uma função que "intercepta" cada requisição
// antes que ela seja enviada.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    // ADICIONE ESTA LINHA PARA VER O QUE FOI ENCONTRADO
    console.log("Interceptador: Tentando usar o token:", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // ADICIONE ESTA LINHA PARA CONFIRMAR QUE O CABEÇALHO FOI ADICIONADO
      console.log("Interceptador: Cabeçalho de autorização foi adicionado.");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;