import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importando useNavigate para redirecionamento
import api from '../api/axiosConfig';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const navigate = useNavigate(); // Hook para navegação

  useEffect(() => {
    // Verifica se há um token no localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redireciona para a página de login se não houver token
      return;
    }

    // Função para buscar os clientes
    const fetchClientes = async () => {
      try {
        const response = await api.get('/clientes');
        setClientes(response.data);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    };

    fetchClientes();
  }, [navigate]); // O hook useNavigate é passado na dependência do useEffect

  return (
    <div>
      <h1>Gestão de Clientes</h1>
      <ul>
        {clientes.map((cliente) => (
          <li key={cliente.id}>{cliente.nome}</li>
        ))}
      </ul>
    </div>
  );
};

export default Clientes;
