import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import api from '../../../api/axiosConfig';
import ClienteForm from './ClienteForm';

const AddClienteModal = ({ isOpen, onClose, onClienteAdded }) => {
  const [newCliente, setNewCliente] = useState({
    nome: '',
    contato: '',
    email: '',
    endereco: ''
  });

  const handleAddCliente = async (e) => {
    e.preventDefault();
    try {
      await api.post('/clientes', newCliente);
      onClienteAdded();
      onClose();
      setNewCliente({ nome: '', contato: '', email: '', endereco: '' });
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Adicionar Cliente</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <ClienteForm
          cliente={newCliente}
          onChange={setNewCliente}
          onSubmit={handleAddCliente}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};

export default AddClienteModal;