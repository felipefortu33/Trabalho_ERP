import React, { useEffect, useState } from 'react';
import './Produtos.css';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import api from '../api/axiosConfig';

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduto, setSelectedProduto] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newProduto, setNewProduto] = useState({ nome: '', descricao: '', categoria: '', preco: '', estoque: '' });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [produtoToDelete, setProdutoToDelete] = useState(null);
  const [newProdutoImagem, setNewProdutoImagem] = useState(null);
  const [selectedProdutoImagem, setSelectedProdutoImagem] = useState(null);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await api.get('/produtos');
        setProdutos(response.data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    fetchProdutos();
  }, []);

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

      const response = await api.post('/produtos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setProdutos([...produtos, response.data]);
      setIsAddModalOpen(false);
      setNewProduto({ nome: '', descricao: '', categoria: '', preco: '', estoque: '' });
      setNewProdutoImagem(null);
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
    }
  };

  const handleUpdateProduto = async (e) => {
    e.preventDefault();

    if (!selectedProduto.nome || !selectedProduto.descricao || !selectedProduto.categoria ||
      selectedProduto.preco === '' || selectedProduto.estoque === '') {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    const formData = new FormData();
    const camposEditaveis = ['nome', 'descricao', 'categoria', 'preco', 'estoque'];
    camposEditaveis.forEach((campo) => {
      if (selectedProduto[campo] !== undefined && selectedProduto[campo] !== null) {
        formData.append(campo, selectedProduto[campo]);
      }
    });

    if (selectedProdutoImagem) {
      formData.append('imagem', selectedProdutoImagem);
    }

    try {
      const response = await api.put(`/produtos/${selectedProduto.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log('Produto atualizado:', response.data);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
    }
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

  const handleDelete = (produto) => {
    setProdutoToDelete(produto);
    setIsDeleteModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProduto(null);
    setSelectedProdutoImagem(null);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setNewProduto({ nome: '', descricao: '', categoria: '', preco: '', estoque: '' });
    setNewProdutoImagem(null);
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
          <FiPlus size={16} /> Adicionar
        </button>
      </div>

      <div className="produtos-table-container">
        {produtos.length === 0 ? (
          <p>Nenhum produto cadastrado.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Imagem</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto) => (
                <tr key={produto.id}>
                  <td>{produto.nome}</td>
                  <td>{produto.descricao}</td>
                  <td>{produto.categoria}</td>
                  <td>{produto.preco}</td>
                  <td>{produto.estoque}</td>
                  
                    <td>
                      {produto.url && (
                        <img src={`data:image/jpeg;base64,${produto.url}`} alt={produto.nome} width="250" />
                      )}
                    </td>
                    
                  
                  <td>
                    <button onClick={() => handleEdit(produto)}>
                      <FiEdit />
                    </button>
                    <button onClick={() => handleDelete(produto)}>
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de Adição */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Adicionar Produto</h2>
            <form onSubmit={handleAddProduto}>
              <input
                type="text"
                placeholder="Nome"
                value={newProduto.nome}
                onChange={(e) => setNewProduto({ ...newProduto, nome: e.target.value })}
              />
              <input
                type="text"
                placeholder="Descrição"
                value={newProduto.descricao}
                onChange={(e) => setNewProduto({ ...newProduto, descricao: e.target.value })}
              />
              <input
                type="text"
                placeholder="Categoria"
                value={newProduto.categoria}
                onChange={(e) => setNewProduto({ ...newProduto, categoria: e.target.value })}
              />
              <input
                type="number"
                placeholder="Preço"
                value={newProduto.preco}
                onChange={(e) => setNewProduto({ ...newProduto, preco: e.target.value })}
              />
              <input
                type="number"
                placeholder="Estoque"
                value={newProduto.estoque}
                onChange={(e) => setNewProduto({ ...newProduto, estoque: e.target.value })}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewProdutoImagem(e.target.files[0])}
              />
              <button type="submit">Adicionar</button>
              <button type="button" onClick={handleCloseAddModal}>Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {isEditModalOpen && selectedProduto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Editar Produto</h2>
            <form onSubmit={handleUpdateProduto}>
              <input
                type="text"
                placeholder="Nome"
                value={selectedProduto.nome}
                onChange={(e) => setSelectedProduto({ ...selectedProduto, nome: e.target.value })}
              />
              <input
                type="text"
                placeholder="Descrição"
                value={selectedProduto.descricao}
                onChange={(e) => setSelectedProduto({ ...selectedProduto, descricao: e.target.value })}
              />
              <input
                type="text"
                placeholder="Categoria"
                value={selectedProduto.categoria}
                onChange={(e) => setSelectedProduto({ ...selectedProduto, categoria: e.target.value })}
              />
              <input
                type="number"
                placeholder="Preço"
                value={selectedProduto.preco}
                onChange={(e) => setSelectedProduto({ ...selectedProduto, preco: e.target.value })}
              />
              <input
                type="number"
                placeholder="Estoque"
                value={selectedProduto.estoque}
                onChange={(e) => setSelectedProduto({ ...selectedProduto, estoque: e.target.value })}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedProdutoImagem(e.target.files[0])}
              />
              <button type="submit">Atualizar</button>
              <button type="button" onClick={handleCloseEditModal}>Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {isDeleteModalOpen && produtoToDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Tem certeza que deseja excluir este produto?</h2>
            <p>{produtoToDelete.nome}</p>
            <button onClick={handleDeleteConfirm}>Sim, excluir</button>
            <button type="button" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Produtos;