import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const AdicionarCliente = () => {
  const [formData, setFormData] = useState({
    nome: '',
    contato: '',
    email: '',
    endereco: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/clientes', formData);
      alert('Cliente cadastrado com sucesso!');
      navigate('/clientes');
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      alert('Erro ao cadastrar cliente');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Adicionar Cliente</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <input type="text" name="nome" placeholder="Nome" value={formData.nome} onChange={handleChange} required />
          <input type="text" name="contato" placeholder="Contato" value={formData.contato} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="text" name="endereco" placeholder="Endereço" value={formData.endereco} onChange={handleChange} required />
          <button type="submit">Cadastrar</button>
        </form>
      </div>
    </div>
  );
};

export default AdicionarCliente;
