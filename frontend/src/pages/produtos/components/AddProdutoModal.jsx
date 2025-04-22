import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import api from '../../../api/axiosConfig';
import ProdutoForm from './ProdutoForm';

const AddProdutoModal = ({ isOpen, onClose, fetchProdutos }) => {
  const [newProduto, setNewProduto] = useState({ 
    nome: '', 
    descricao: '', 
    categoria: '', 
    preco: '', 
    estoque: '' 
  });
  const [newProdutoImagem, setNewProdutoImagem] = useState(null);

  const handleAddProduto = async (e) => {
    e.preventDefault();

    if (!newProduto.nome || !newProduto.descricao || !newProduto.categoria ||
      newProduto.preco === '' || newProduto.estoque === '') {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const formData = new FormData();
      for (const key in newProduto) {
        formData.append(key, newProduto[key]);
      }
      if (newProdutoImagem) {
        formData.append('imagem', newProdutoImagem);
      }

      await api.post('/produtos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      onClose();
      setNewProduto({ nome: '', descricao: '', categoria: '', preco: '', estoque: '' });
      setNewProdutoImagem(null);
      fetchProdutos();
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Adicionar Produto</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <ProdutoForm
          produto={newProduto}
          setProduto={setNewProduto}
          imagem={newProdutoImagem}
          setImagem={setNewProdutoImagem}
          onSubmit={handleAddProduto}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};

export default AddProdutoModal;