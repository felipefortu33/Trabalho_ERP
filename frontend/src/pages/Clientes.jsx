import React, { useEffect, useState } from 'react';
import './Clientes.css';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import api from '../api/axiosConfig';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCliente, setNewCliente] = useState({
    nome: '',
    contato: '',
    email: '',
    endereco: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchClientes = async () => {
      try {
        const response = await api.get('/clientes');
        setClientes(response.data);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    };

    fetchClientes();
  }, [navigate]);

  const handleSearch = async () => {
    try {
      const response = await api.get(`/clientes/search?nome=${searchTerm}`);
      setClientes(response.data);
    } catch (error) {
      console.error('Erro ao pesquisar clientes:', error);
    }
  };

  const handleEdit = (id) => {
    const cliente = clientes.find((cliente) => cliente.id === id);
    setSelectedCliente(cliente);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCliente(null);
  };

  const handleUpdateCliente = async (e) => {
    e.preventDefault();
    const { nome, contato, email, endereco } = selectedCliente;
    try {
      await api.put(`/clientes/${selectedCliente.id}`, {
        nome,
        contato,
        email,
        endereco,
      });
      setClientes(
        clientes.map((cliente) =>
          cliente.id === selectedCliente.id ? selectedCliente : cliente
        )
      );
      handleModalClose();
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/clientes/${confirmDeleteId}`);
      setClientes(clientes.filter((cliente) => cliente.id !== confirmDeleteId));
      setConfirmDeleteId(null);
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
    }
  };

  const handleAddCliente = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/clientes', newCliente);
      setClientes([...clientes, response.data]);
      setIsAddModalOpen(false);
      setNewCliente({ nome: '', contato: '', email: '', endereco: '' });
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
    }
  };

  return (
    <div className="clientes-container">
      <div className="clientes-header">
        <h1>Gestão de Clientes</h1>
        <div className="clientes-actions">
          <input
            type="text"
            placeholder="Pesquisar por nome"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Pesquisar</button>
          <button onClick={() => setIsAddModalOpen(true)}>
            <FiPlus size={16} />
            Adicionar
          </button>
        </div>
      </div>

      <div className="clientes-table-container">
        {clientes.length === 0 ? (
          <p className="no-clientes">Nenhum cliente cadastrado.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Contato</th>
                <th>Email</th>
                <th>Endereço</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.nome}</td>
                  <td>{cliente.contato}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.endereco}</td>
                  <td className="clientes-actions-buttons">
                    <button
                      className="btn-icon editar"
                      onClick={() => handleEdit(cliente.id)}
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="btn-icon excluir"
                      onClick={() => setConfirmDeleteId(cliente.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de Edição */}
      {isModalOpen && selectedCliente && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Editar Cliente</h2>
            <form onSubmit={handleUpdateCliente}>
              <label>Nome</label>
              <input
                type="text"
                value={selectedCliente.nome}
                onChange={(e) =>
                  setSelectedCliente({ ...selectedCliente, nome: e.target.value })
                }
              />
              <label>Contato</label>
              <input
                type="text"
                value={selectedCliente.contato}
                onChange={(e) =>
                  setSelectedCliente({ ...selectedCliente, contato: e.target.value })
                }
              />
              <label>Email</label>
              <input
                type="email"
                value={selectedCliente.email}
                onChange={(e) =>
                  setSelectedCliente({ ...selectedCliente, email: e.target.value })
                }
              />
              <label>Endereço</label>
              <input
                type="text"
                value={selectedCliente.endereco}
                onChange={(e) =>
                  setSelectedCliente({ ...selectedCliente, endereco: e.target.value })
                }
              />
              <div className="modal-actions">
                <button type="submit">Atualizar Cliente</button>
                <button type="button" onClick={handleModalClose} className="cancel-btn">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Adição */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Adicionar Cliente</h2>
            <form onSubmit={handleAddCliente}>
              <label>Nome</label>
              <input
                type="text"
                value={newCliente.nome}
                onChange={(e) =>
                  setNewCliente({ ...newCliente, nome: e.target.value })
                }
                required
              />
              <label>Contato</label>
              <input
                type="text"
                value={newCliente.contato}
                onChange={(e) =>
                  setNewCliente({ ...newCliente, contato: e.target.value })
                }
                required
              />
              <label>Email</label>
              <input
                type="email"
                value={newCliente.email}
                onChange={(e) =>
                  setNewCliente({ ...newCliente, email: e.target.value })
                }
                required
              />
              <label>Endereço</label>
              <input
                type="text"
                value={newCliente.endereco}
                onChange={(e) =>
                  setNewCliente({ ...newCliente, endereco: e.target.value })
                }
                required
              />
              <div className="modal-actions">
                <button type="submit">Cadastrar Cliente</button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="cancel-btn"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {confirmDeleteId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Tem certeza que deseja excluir?</h2>
            <div className="modal-actions">
              <button onClick={handleDelete} className="btn-excluir">
                Sim, Excluir
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="cancel-btn"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;
