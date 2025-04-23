import React, { useState } from 'react';
import './Modal.css';
import api from '../../../api/axiosConfig';

const AddContaReceberModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    pedido_id: '',
    cliente_id: '',
    valor: '',
    data_vencimento: '',
    forma_pagamento: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/financeiro/contas-receber', {
        ...formData,
        valor: parseFloat(formData.valor),
      });
      onSuccess();  // Atualiza lista no componente pai
      onClose();    // Fecha modal
    } catch (error) {
      console.error('Erro ao adicionar conta a receber:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Adicionar Conta a Receber</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>ID do Pedido</label>
          <input
            type="number"
            name="pedido_id"
            value={formData.pedido_id}
            onChange={handleChange}
          />

          <label>ID do Cliente</label>
          <input
            type="number"
            name="cliente_id"
            value={formData.cliente_id}
            onChange={handleChange}
            required
          />

          <label>Valor</label>
          <input
            type="number"
            name="valor"
            value={formData.valor}
            onChange={handleChange}
            required
            step="0.01"
          />

          <label>Data de Vencimento</label>
          <input
            type="date"
            name="data_vencimento"
            value={formData.data_vencimento}
            onChange={handleChange}
            required
          />

          <label>Forma de Pagamento</label>
          <input
            type="text"
            name="forma_pagamento"
            value={formData.forma_pagamento}
            onChange={handleChange}
          />

          <div className="modal-actions">
            <button type="submit">Salvar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContaReceberModal;
