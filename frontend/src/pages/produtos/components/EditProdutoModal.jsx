import React, { useState, useEffect } from 'react'; // Adicione useEffect
import { FiX } from 'react-icons/fi';
import api from '../../../api/axiosConfig';
import ProdutoForm from './ProdutoForm';

const EditProdutoModal = ({ isOpen, onClose, produto, fetchProdutos }) => {
  const [editedProduto, setEditedProduto] = useState({
    nome: '',
    descricao: '',
    categoria: '',
    preco: '',
    estoque: ''
  });
  const [produtoImagem, setProdutoImagem] = useState(null);

  // Atualize o estado quando o produto prop mudar
  useEffect(() => {
    if (produto) {
      setEditedProduto(produto);
    }
  }, [produto]);

  const handleUpdateProduto = async (e) => {
    e.preventDefault();

    if (!editedProduto.nome || !editedProduto.descricao || !editedProduto.categoria ||
      editedProduto.preco === '' || editedProduto.estoque === '') {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    const formData = new FormData();
    const camposEditaveis = ['nome', 'descricao', 'categoria', 'preco', 'estoque'];
    camposEditaveis.forEach((campo) => {
      if (editedProduto[campo] !== undefined && editedProduto[campo] !== null) {
        formData.append(campo, editedProduto[campo]);
      }
    });

    if (produtoImagem) {
      formData.append('imagem', produtoImagem);
    }

    try {
      await api.put(`/produtos/${editedProduto.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      onClose();
      fetchProdutos();
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Editar Produto</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        {editedProduto && (
          <ProdutoForm
            produto={editedProduto}
            setProduto={setEditedProduto}
            imagem={produtoImagem}
            setImagem={setProdutoImagem}
            onSubmit={handleUpdateProduto}
            onCancel={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default EditProdutoModal;