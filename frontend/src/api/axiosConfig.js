import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Substitua pela URL do seu back-end
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;