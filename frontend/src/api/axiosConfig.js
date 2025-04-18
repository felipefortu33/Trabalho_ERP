import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Substitua pela URL do seu back-end
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepta as requisições para adicionar o token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Adiciona o token no cabeçalho Authorization
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  // Caso aconteça algum erro durante a requisição, o erro é retornado.
  return Promise.reject(error);
});

export default api;
