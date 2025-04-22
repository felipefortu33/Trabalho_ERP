// src/pages/Pedidos/Pedidos.jsx
import React, { useEffect, useState } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import api from '../../api/axiosConfig';
import PedidoList from './components/PedidoList';
import PedidoModal from './components/PedidoModal';
import EditPedidoModal from './components/EditPedidoModal';
import SearchBox from './components/SearchBox';
import './Pedidos.css';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [pedidoEditando, setPedidoEditando] = useState(null);

  useEffect(() => {
    fetchDados();
  }, []);

  const fetchDados = async () => {
    setIsLoading(true);
    try {
      const [pedidosRes, clientesRes, produtosRes] = await Promise.all([
        api.get('/pedidos'),
        api.get('/clientes'),
        api.get('/produtos')
      ]);
      setPedidos(pedidosRes.data);
      setClientes(clientesRes.data);
      setProdutos(produtosRes.data);
      setError(null);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setError('Erro ao carregar dados. Tente recarregar a página.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPedido = async (pedido) => {
    try {
      const response = await api.get(`/pedidos/${pedido.id}`);
      setPedidoEditando(response.data);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Erro ao buscar detalhes do pedido:', error);
    }
  };

  const handleDeletePedido = async (id) => {
    try {
      const confirmMessage = 'Tem certeza que deseja deletar este pedido? ' +
        'Os produtos serão devolvidos ao estoque se o pedido estiver pendente ou cancelado.';
      
      if (!window.confirm(confirmMessage)) {
        return;
      }
  
      const token = localStorage.getItem('token');
      const response = await api.delete(`/pedidos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.message) {
        let feedbackMessage = 'Pedido excluído com sucesso!';
        
        if (response.data.estoque_restaurado) {
          feedbackMessage += `\nProdutos devolvidos ao estoque (Status anterior: ${response.data.status_original})`;
        } else {
          feedbackMessage += `\nO estoque não foi alterado (Status anterior: ${response.data.status_original})`;
        }
        
        alert(feedbackMessage);
        fetchDados();
      }
    } catch (error) {
      console.error('Erro detalhado:', error.response?.data || error.message);
      alert(`Erro ao excluir pedido: ${error.response?.data?.error || error.message}`);
    }
  };

  if (isLoading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="pedidos-container">
      <h1>
        <FiShoppingCart /> Gestão de Pedidos
      </h1>
      
      <div className="pedidos-actions">
        <SearchBox 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          placeholder="Pesquisar por cliente ou produto..."
        />
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          Novo Pedido
        </button>
      </div>

      <PedidoList 
        pedidos={pedidos}
        searchTerm={searchTerm}
        handleEditPedido={handleEditPedido}
        handleDeletePedido={handleDeletePedido}
      />

      <PedidoModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        clientes={clientes}
        produtos={produtos}
        fetchDados={fetchDados}
      />

      {pedidoEditando && (
        <EditPedidoModal 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          pedido={pedidoEditando}
          clientes={clientes}
          fetchDados={fetchDados}
        />
      )}
    </div>
  );
};

export default Pedidos;