import React from 'react';
import { FiX } from 'react-icons/fi';

const DeleteProdutoModal = ({ isOpen, onClose, produto, onConfirm }) => {
  if (!isOpen || !produto) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Tem certeza que deseja excluir este produto?</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <p>{produto.nome}</p>
        <div className="modal-actions">
          <button onClick={onConfirm}>Sim, excluir</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProdutoModal;