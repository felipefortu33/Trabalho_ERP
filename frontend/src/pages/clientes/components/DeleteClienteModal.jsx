import React from 'react';
import { FiX } from 'react-icons/fi';

const DeleteClienteModal = ({ cliente, onClose, onConfirm }) => {
    if (!cliente) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Confirmar Exclusão</h2>
                    <button className="close-btn" onClick={onClose}>
                        <FiX />
                    </button>
                </div>
                <p>Tem certeza que deseja excluir o cliente {cliente.nome}?</p>
        
                <div className="form-actions">
                    <button onClick={onConfirm} className="btn-delete">
                        Confirmar
                    </button>
                    <button onClick={onClose} className="btn-cancel">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteClienteModal;