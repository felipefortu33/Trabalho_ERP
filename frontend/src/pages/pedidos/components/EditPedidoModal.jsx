// src/pages/Pedidos/components/EditPedidoModal.jsx
import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import api from '../../../api/axiosConfig';

const EditPedidoModal = ({ isOpen, onClose, pedido, clientes, fetchDados }) => {
  const [pedidoEditando, setPedidoEditando] = useState(pedido);

  const handleUpdatePedido = async (e) => {
    e.preventDefault();
    
    if (!pedidoEditando.produtos || pedidoEditando.produtos.length === 0) {
      alert('O pedido deve ter pelo menos um produto');
      return;
    }
  
    try {
      const dadosAtualizacao = {
        cliente_id: pedidoEditando.cliente.id,
        status: pedidoEditando.status,
        produto_id: pedidoEditando.produtos[0].produto_id,
        quantidade: pedidoEditando.produtos[0].quantidade,
        atualizacao_completa: true
      };
  
      const response = await api.put(`/pedidos/${pedidoEditando.id}`, dadosAtualizacao);
      
      if (response.data.message) {
        let mensagem = 'Pedido atualizado com sucesso!';
        
        if (response.data.estoque_atualizado) {
          mensagem += `\nEstoque atualizado (Status: ${pedidoEditando.status})`;
        }
        
        alert(mensagem);
      }
  
      onClose();
      fetchDados();
      
    } catch (error) {
      console.error('Erro detalhado na atualização:', {
        error: error.response?.data || error.message,
        pedido: pedidoEditando
      });
      
      const mensagemErro = error.response?.data?.error || 
                        error.response?.data?.message || 
                        'Erro ao atualizar pedido';
      
      alert(`Erro: ${mensagemErro}`);
    }
  };

  const calcularTotalPedido = (pedido) => {
    return pedido.produtos.reduce((total, produto) => {
      return total + (produto.preco * produto.quantidade);
    }, 0).toFixed(2);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Editar Pedido #{pedidoEditando.id}</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <form onSubmit={handleUpdatePedido}>
          <div className="form-group">
            <label>Cliente</label>
            <select
              value={pedidoEditando.cliente.id}
              onChange={(e) => setPedidoEditando({
                ...pedidoEditando,
                cliente: {
                  ...pedidoEditando.cliente,
                  id: e.target.value
                }
              })}
              required
            >
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Produtos</label>
            <ul className="produtos-selecionados">
              {pedidoEditando.produtos.map((produto, index) => (
                <li key={index}>
                  <div className="produto-selecionado-info">
                    <span>{produto.quantidade}x {produto.nome}</span>
                    <span>R$ {(produto.preco * produto.quantidade).toFixed(2)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={pedidoEditando.status}
              onChange={(e) => setPedidoEditando({ ...pedidoEditando, status: e.target.value })}
            >
              <option value="Pendente">Pendente</option>
              <option value="Processando">Processando</option>
              <option value="Concluído">Concluído</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>

          <div className="form-total">
            <strong>Total:</strong> R$ {calcularTotalPedido(pedidoEditando)}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Salvar Alterações
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPedidoModal;