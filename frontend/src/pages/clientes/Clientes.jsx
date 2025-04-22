import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Clientes.css';
import api from '../../api/axiosConfig';
import ClienteList from './components/ClienteList';
import AddClienteModal from './components/AddClienteModal';
import EditClienteModal from './components/EditClienteModal';
import DeleteClienteModal from './components/DeleteClienteModal';
import SearchBox from './components/SearchBox';

const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [clienteToDelete, setClienteToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchClientes();
    }, [navigate]);

    const fetchClientes = async () => {
        try {
            const response = await api.get('/clientes');
            setClientes(response.data);
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
        }
    };

    const handleSearch = async () => {
        try {
            const response = await api.get(`/clientes/search?nome=${searchTerm}`);
            setClientes(response.data);
        } catch (error) {
            console.error('Erro ao pesquisar clientes:', error);
        }
    };

    const handleEdit = (cliente) => {
        setSelectedCliente(cliente);
        setIsEditModalOpen(true);
    };

    const handleDelete = (cliente) => {
        setClienteToDelete(cliente);
    };

    const handleDeleteConfirm = async () => {
        try {
            await api.delete(`/clientes/${clienteToDelete.id}`);
            setClientes(clientes.filter(c => c.id !== clienteToDelete.id));
            setClienteToDelete(null);
        } catch (error) {
            console.error('Erro ao excluir cliente:', error);
        }
    };

    return (
        <div className="clientes-container">
            <h1>Gestão de Clientes</h1>

            <div className="clientes-actions">
                <SearchBox
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onSearch={handleSearch}
                    placeholder="Pesquisar por nome"
                />
                <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
                    Adicionar Cliente
                </button>
            </div>

            <ClienteList
                clientes={clientes}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <AddClienteModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onClienteAdded={fetchClientes}
            />

            <EditClienteModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                cliente={selectedCliente}
                onClienteUpdated={fetchClientes}
            />

            <DeleteClienteModal
                cliente={clienteToDelete}
                onClose={() => setClienteToDelete(null)}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
};

export default Clientes;