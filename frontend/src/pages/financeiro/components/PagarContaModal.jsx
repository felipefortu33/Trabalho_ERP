import React, { useState } from 'react';
import './Modal.css';
import api from '../../../api/axiosConfig';

const PagarContaModal = ({ isOpen, onClose, conta, tipo, onSuccess }) => {
  const [formData, setFormData] = useState({
    data_pagamento: '',
    forma_pagamento: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/financeiro/contas-${tipo}/${conta.id}/pagar`, formData);
      onSuccess();  // Atualiza a lista
      onClose();    // Fecha o modal
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
    }
  };

  if (!isOpen || !conta) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Registrar Pagamento</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <p><strong>Descrição:</strong> {conta.descricao || conta.referencia}</p>
          <p><strong>Valor:</strong> R$ {Number(conta.valor).toFixed(2)}</p>

          <label>Data do Pagamento</label>
          <input
            type="date"
            name="data_pagamento"
            value={formData.data_pagamento}
            onChange={handleChange}
            required
          />

          <label>Forma de Pagamento</label>
          <input
            type="text"
            name="forma_pagamento"
            value={formData.forma_pagamento}
            onChange={handleChange}
            required
          />

          <div className="modal-actions">
            <button type="submit">Confirmar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PagarContaModal;
