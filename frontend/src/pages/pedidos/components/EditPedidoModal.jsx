import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import api from '../../../api/axiosConfig';

const EditPedidoModal = ({ isOpen, onClose, pedido, clientes, fetchDados }) => {
  const [pedidoEditando, setPedidoEditando] = useState(pedido);
  const [adicionarContaReceber, setAdicionarContaReceber] = useState(false);
  const [parcelas, setParcelas] = useState(1);
  const [dataPrimeiroVencimento, setDataPrimeiroVencimento] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('');

  useEffect(() => {
    if (pedido) {
      setPedidoEditando(pedido);
      // Verifica se o pedido já tem contas a receber associadas
      setAdicionarContaReceber(pedido.status === 'Concluído' && !pedido.contas_receber?.length);
    }
  }, [pedido]);

  const handleUpdatePedido = async (e) => {
    e.preventDefault();
    try {
      const updatedPedido = {
        cliente_id: pedidoEditando.cliente.id,
        status: pedidoEditando.status,
        atualizacao_completa: true
      };

      const response = await api.put(`/pedidos/${pedidoEditando.id}`, updatedPedido);

      if (response.data.message) {
        // Se o pedido foi marcado como Concluído e a opção de adicionar conta está ativada
        if (pedidoEditando.status === 'Concluído' && adicionarContaReceber) {
          await criarContasReceber();
        }

        alert('Pedido atualizado com sucesso!');
        fetchDados();
        onClose();
      }
    } catch (error) {
      console.error('Erro detalhado na atualização:', error.response?.data || error.message);
      alert(`Erro ao atualizar pedido: ${error.response?.data?.error || error.message}`);
    }
  };

  const criarContasReceber = async () => {
    const total = calcularTotalPedido(pedidoEditando);
    const valorParcela = total / parcelas;
    const vencimentos = calcularDatasVencimento(parcelas, dataPrimeiroVencimento);

    try {
      for (let i = 0; i < parcelas; i++) {
        await api.post('/financeiro/contas-receber', {
          pedido_id: pedidoEditando.id,
          cliente_id: pedidoEditando.cliente.id,
          valor: valorParcela.toFixed(2),
          data_vencimento: vencimentos[i],
          forma_pagamento: formaPagamento,
          descricao: `Parcela ${i + 1}/${parcelas} - Pedido #${pedidoEditando.id}`
        });
      }
      alert(`${parcelas} conta(s) a receber criada(s) com sucesso!`);
    } catch (error) {
      console.error('Erro ao criar contas a receber:', error);
      alert('Pedido atualizado, mas houve um erro ao criar as contas a receber.');
    }
  };

  const calcularDatasVencimento = (numParcelas, dataInicial) => {
    const datas = [];
    const data = new Date(dataInicial);
    
    for (let i = 0; i < numParcelas; i++) {
      const novaData = new Date(data);
      novaData.setMonth(data.getMonth() + i);
      datas.push(novaData.toISOString().split('T')[0]);
    }
    
    return datas;
  };

  const calcularTotalPedido = (pedido) => {
    return pedido.produtos.reduce((total, produto) => {
      return total + (produto.preco * produto.quantidade);
    }, 0);
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

          {pedidoEditando.status === 'Concluído' && (
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={adicionarContaReceber}
                  onChange={(e) => setAdicionarContaReceber(e.target.checked)}
                />
                Adicionar contas a receber para este pedido
              </label>
              
              {adicionarContaReceber && (
                <div className="contas-receber-options">
                  <div className="form-subgroup">
                    <label>Número de parcelas</label>
                    <input
                      type="number"
                      min="1"
                      value={parcelas}
                      onChange={(e) => setParcelas(Math.max(1, parseInt(e.target.value) || 1))}
                    />
                  </div>
                  
                  <div className="form-subgroup">
                    <label>Primeiro vencimento</label>
                    <input
                      type="date"
                      value={dataPrimeiroVencimento}
                      onChange={(e) => setDataPrimeiroVencimento(e.target.value)}
                      required={adicionarContaReceber}
                    />
                  </div>
                  
                  <div className="form-subgroup">
                    <label>Forma de pagamento</label>
                    <input
                      type="text"
                      value={formaPagamento}
                      onChange={(e) => setFormaPagamento(e.target.value)}
                      placeholder="Ex: Boleto, Cartão, etc."
                      required={adicionarContaReceber}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="form-total">
            <strong>Total:</strong> R$ {calcularTotalPedido(pedidoEditando).toFixed(2)}
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