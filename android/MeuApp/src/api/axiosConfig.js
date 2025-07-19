// src/api/axiosConfig.js

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://192.168.100.11:5000', // ajuste para seu IP local
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepta as requisições para adicionar o token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
