import React, { useState } from 'react';
import './Modal.css';
import api from '../../../api/axiosConfig';

const AddContaPagarModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    data_vencimento: '',
    fornecedor: '',
    categoria: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/financeiro/contas-pagar', {
        ...formData,
        valor: parseFloat(formData.valor),
      });
      onSuccess();  // Atualiza a lista no componente pai
      onClose();    // Fecha o modal
    } catch (error) {
      console.error('Erro ao adicionar conta a pagar:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Adicionar Conta a Pagar</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>Descrição</label>
          <input
            type="text"
            name="descricao"
            value={formData.descricao}
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

          <label>Fornecedor</label>
          <input
            type="text"
            name="fornecedor"
            value={formData.fornecedor}
            onChange={handleChange}
            required
          />

          <label>Categoria</label>
          <input
            type="text"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
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

export default AddContaPagarModal;
