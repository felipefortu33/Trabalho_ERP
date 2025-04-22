import React, { useEffect, useState } from 'react';
import './Produtos.css';
import api from '../../api/axiosConfig';
import ProdutoList from './components/ProdutoList';
import AddProdutoModal from './components/AddProdutoModal';
import EditProdutoModal from './components/EditProdutoModal';
import DeleteProdutoModal from './components/DeleteProdutoModal';

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduto, setSelectedProduto] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [produtoToDelete, setProdutoToDelete] = useState(null);

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      const response = await api.get('/produtos');
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await api.get(`/produtos/search?nome=${searchTerm}`);
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao pesquisar produtos:', error);
    }
  };

  const handleEdit = (produto) => {
    setSelectedProduto(produto);
    setIsEditModalOpen(true);
  };

  const handleDelete = (produto) => {
    setProdutoToDelete(produto);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!produtoToDelete) return;

    try {
      await api.delete(`/produtos/${produtoToDelete.id}`);
      setProdutos(produtos.filter((produto) => produto.id !== produtoToDelete.id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      alert(`Erro ao excluir produto: ${error.response ? error.response.data.message : error.message}`);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="produtos-container">
      <h1>Gestão de Produtos</h1>
      
      <div className="produtos-actions">
        <input
          type="text"
          placeholder="Pesquisar por nome"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>
          Pesquisar
        </button>
        <button onClick={() => setIsAddModalOpen(true)}>
          Adicionar
        </button>
      </div>

      <ProdutoList 
        produtos={produtos}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      <AddProdutoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        fetchProdutos={fetchProdutos}
      />

      <EditProdutoModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        produto={selectedProduto}
        fetchProdutos={fetchProdutos}
      />

      <DeleteProdutoModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        produto={produtoToDelete}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default Produtos;