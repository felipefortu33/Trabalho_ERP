import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await api.get('/pedidos');
        setPedidos(response.data);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
      }
    };

    fetchPedidos();
  }, []);

  return (
    <div>
      <h1>Gestão de Pedidos</h1>
      <ul>
        {pedidos.map((pedido) => (
          <li key={pedido.id}>Pedido #{pedido.id} - {pedido.descricao}</li>
        ))}
      </ul>
    </div>
  );
};

export default Pedidos;