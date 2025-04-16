import React, { useState } from 'react';
import api from '../api/axiosConfig';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', formData);
      alert('Login realizado com sucesso!');
      localStorage.setItem('token', response.data.token);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Erro ao realizar login.');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="senha"
          placeholder="Senha"
          value={formData.senha}
          onChange={handleChange}
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;