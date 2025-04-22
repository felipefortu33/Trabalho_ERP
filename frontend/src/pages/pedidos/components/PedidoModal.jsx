// src/pages/Pedidos/components/PedidoModal.jsx
import React, { useState } from 'react';
import { FiX, FiSearch } from 'react-icons/fi';
import PedidoForm from './PedidoForm';

const PedidoModal = ({ isOpen, onClose, clientes, produtos, fetchDados }) => {
  const [produtoBuscaTermo, setProdutoBuscaTermo] = useState('');
  const [produtosEncontrados, setProdutosEncontrados] = useState([]);
  const [quantidadeProduto, setQuantidadeProduto] = useState(1);
  const [novoPedido, setNovoPedido] = useState({
    cliente_id: '',
    produtos: [],
    status: 'Pendente'
  });

  const buscarProdutos = () => {
    if (!produtoBuscaTermo.trim()) {
      setProdutosEncontrados([]);
      return;
    }
    const encontrados = produtos.filter(p =>
      p.nome.toLowerCase().includes(produtoBuscaTermo.toLowerCase())
    );
    setProdutosEncontrados(encontrados);
  };

  const adicionarProdutoAoPedido = (produto) => {
    const produtoExistente = novoPedido.produtos.find(p => p.produto_id === produto.id);
    
    if (produtoExistente) {
      setNovoPedido(prev => ({
        ...prev,
        produtos: prev.produtos.map(p =>
          p.produto_id === produto.id
            ? { ...p, quantidade: p.quantidade + quantidadeProduto }
            : p
        )
      }));
    } else {
      setNovoPedido(prev => ({
        ...prev,
        produtos: [
          ...prev.produtos,
          {
            produto_id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            quantidade: quantidadeProduto
          }
        ]
      }));
    }
    
    setProdutoBuscaTermo('');
    setProdutosEncontrados([]);
    setQuantidadeProduto(1);
  };

  const removerProdutoDoPedido = (produtoId) => {
    setNovoPedido(prev => ({
      ...prev,
      produtos: prev.produtos.filter(p => p.produto_id !== produtoId)
    }));
  };

  const handleAddPedido = async (e) => {
    e.preventDefault();
    try {
      if (novoPedido.produtos.length === 0) {
        alert('Adicione pelo menos um produto ao pedido');
        return;
      }

      await api.post('/pedidos/multiplos', {
        cliente_id: novoPedido.cliente_id,
        produtos: novoPedido.produtos.map(p => ({
          produto_id: p.produto_id,
          quantidade: p.quantidade
        }))
      });

      onClose();
      setNovoPedido({
        cliente_id: '',
        produtos: [],
        status: 'Pendente'
      });
      fetchDados();
    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao adicionar pedido');
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Novo Pedido</h2>
          <button className="close-btn" onClick={() => {
            onClose();
            setNovoPedido({
              cliente_id: '',
              produtos: [],
              status: 'Pendente'
            });
            setProdutoBuscaTermo('');
            setProdutosEncontrados([]);
          }}>
            <FiX />
          </button>
        </div>
        
        <PedidoForm 
          novoPedido={novoPedido}
          setNovoPedido={setNovoPedido}
          clientes={clientes}
          produtoBuscaTermo={produtoBuscaTermo}
          setProdutoBuscaTermo={setProdutoBuscaTermo}
          produtosEncontrados={produtosEncontrados}
          quantidadeProduto={quantidadeProduto}
          setQuantidadeProduto={setQuantidadeProduto}
          buscarProdutos={buscarProdutos}
          adicionarProdutoAoPedido={adicionarProdutoAoPedido}
          removerProdutoDoPedido={removerProdutoDoPedido}
          handleSubmit={handleAddPedido}
          onClose={() => {
            onClose();
            setNovoPedido({
              cliente_id: '',
              produtos: [],
              status: 'Pendente'
            });
            setProdutoBuscaTermo('');
            setProdutosEncontrados([]);
          }}
        />
      </div>
    </div>
  );
};

export default PedidoModal;