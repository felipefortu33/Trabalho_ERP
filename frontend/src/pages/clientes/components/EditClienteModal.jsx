import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import api from '../../../api/axiosConfig';
import ClienteForm from './ClienteForm';

const EditClienteModal = ({ isOpen, onClose, cliente, onClienteUpdated }) => {
  const [editedCliente, setEditedCliente] = useState({
    nome: '',
    contato: '',
    email: '',
    endereco: ''
  });

  useEffect(() => {
    if (cliente) {
      setEditedCliente(cliente);
    }
  }, [cliente]);

  const handleUpdateCliente = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/clientes/${editedCliente.id}`, editedCliente);
      onClienteUpdated();
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Editar Cliente</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <ClienteForm
          cliente={editedCliente}
          onChange={setEditedCliente}
          onSubmit={handleUpdateCliente}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};

export default EditClienteModal;