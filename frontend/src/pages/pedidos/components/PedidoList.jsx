// src/pages/Pedidos/components/PedidoList.jsx
import React from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import StatusBadge from './StatusBadge';

const PedidoList = ({ pedidos, searchTerm, handleEditPedido, handleDeletePedido }) => {
  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calcularTotalPedido = (pedido) => {
    return pedido.produtos.reduce((total, produto) => {
      return total + (produto.preco * produto.quantidade);
    }, 0).toFixed(2);
  };

  const pedidosFiltrados = pedidos.filter(pedido =>
    pedido.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pedido.produtos.some(produto =>
      produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="pedidos-table-container">
      {pedidosFiltrados.length === 0 ? (
        <p>Nenhum pedido encontrado.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Produtos</th>
              <th>Total</th>
              <th>Data</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.map((pedido) => (
              <tr key={pedido.id}>
                <td>#{pedido.id}</td>
                <td>{pedido.cliente.nome}</td>
                <td>
                  <ul className="produtos-list">
                    {pedido.produtos.map((produto, idx) => (
                      <li key={idx}>
                        {produto.quantidade}x {produto.nome} (R$ {produto.preco})
                      </li>
                    ))}
                  </ul>
                </td>
                <td>R$ {calcularTotalPedido(pedido)}</td>
                <td>{formatarData(pedido.data)}</td>
                <td>
                  <StatusBadge status={pedido.status} />
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-edit" 
                      onClick={() => handleEditPedido(pedido)}
                      title="Editar"
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeletePedido(pedido.id)}
                      title="Excluir"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PedidoList;