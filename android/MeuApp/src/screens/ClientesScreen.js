// src/screens/ClientesScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axiosConfig';
import ClienteList from '../components/clientes/ClienteList';
import AddClienteModal from '../components/clientes/AddClienteModal';
import EditClienteModal from '../components/clientes/EditClienteModal';
import DeleteClienteModal from '../components/clientes/DeleteClienteModal';
import SearchBox from '../components/clientes/SearchBox';
import { useNavigation } from '@react-navigation/native';

const ClientesScreen = () => {
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const verifyTokenAndFetch = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.navigate('Auth');
        return;
      }
      fetchClientes();
    };
    verifyTokenAndFetch();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await api.get('/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      Alert.alert('Erro', 'Não foi possível carregar os clientes.');
    }
  };

  const handleSearch = async () => {
    try {
      const response = await api.get(`/clientes/search?nome=${searchTerm}`);
      setClientes(response.data);
    } catch (error) {
      console.error('Erro ao pesquisar clientes:', error);
      Alert.alert('Erro', 'Erro na pesquisa de clientes.');
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
      Alert.alert('Erro', 'Erro ao excluir cliente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestão de Clientes</Text>

      <SearchBox
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={handleSearch}
        placeholder="Pesquisar por nome"
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setIsAddModalOpen(true)}>
        <Text style={styles.addButtonText}>Adicionar Cliente</Text>
      </TouchableOpacity>

      <ClienteList
        clientes={clientes}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

<AddClienteModal
  isVisible={isAddModalOpen}
  onClose={() => setIsAddModalOpen(false)}
  onClienteAdded={fetchClientes}
/>

<EditClienteModal
  isVisible={isEditModalOpen}
  onClose={() => setIsEditModalOpen(false)}
  cliente={selectedCliente}
  onClienteUpdated={fetchClientes}
/>

<DeleteClienteModal
  isVisible={clienteToDelete !== null}
  cliente={clienteToDelete}
  onClose={() => setClienteToDelete(null)}
  onConfirm={handleDeleteConfirm}
/>
    </View>
  );
};

export default ClientesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
