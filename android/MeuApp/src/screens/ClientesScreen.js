// src/screens/ClientesScreen.js
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  FlatList, 
  RefreshControl,
  StatusBar,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axiosConfig';
import ClienteList from '../components/clientes/ClienteList';
import AddClienteModal from '../components/clientes/AddClienteModal';
import EditClienteModal from '../components/clientes/EditClienteModal';
import DeleteClienteModal from '../components/clientes/DeleteClienteModal';
import SearchBox from '../components/clientes/SearchBox';
import CustomButton from '../components/common/CustomButton';
import AnimatedContainer from '../components/common/AnimatedContainer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { colors, spacing, borderRadius, shadows } from '../utils/colors';
import { Ionicons } from '@expo/vector-icons';

const ClientesScreen = () => {
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();
  const { width } = Dimensions.get('window');
  const isTablet = width > 768;

  const verifyTokenAndFetch = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      navigation.navigate('Auth');
      return;
    }
    await fetchClientes();
  };

  useFocusEffect(
    React.useCallback(() => {
      verifyTokenAndFetch();
    }, [])
  );

  const fetchClientes = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const response = await api.get('/clientes');
      setClientes(response.data);
      setFilteredClientes(response.data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      Alert.alert('Erro', 'Não foi possível carregar os clientes.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchClientes(false);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredClientes(clientes);
    } else {
      const filtered = clientes.filter(cliente => 
        cliente.nome.toLowerCase().includes(term.toLowerCase()) ||
        cliente.email.toLowerCase().includes(term.toLowerCase()) ||
        cliente.telefone.includes(term)
      );
      setFilteredClientes(filtered);
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
      const updatedClientes = clientes.filter(c => c.id !== clienteToDelete.id);
      setClientes(updatedClientes);
      setFilteredClientes(updatedClientes);
      setClienteToDelete(null);
      Alert.alert('Sucesso', 'Cliente excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      Alert.alert('Erro', 'Erro ao excluir cliente.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size={40} color={colors.primary} />
        <Text style={styles.loadingText}>Carregando clientes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      
      {/* Header */}
      <AnimatedContainer animation="fadeInUp" style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Gestão de Clientes</Text>
          <Text style={styles.subtitle}>
            {filteredClientes.length} cliente{filteredClientes.length !== 1 ? 's' : ''} encontrado{filteredClientes.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <View style={styles.statsCard}>
          <Ionicons name="people-outline" size={24} color={colors.primary} />
          <Text style={styles.statsNumber}>{clientes.length}</Text>
        </View>
      </AnimatedContainer>

      {/* Search and Add Button */}
      <AnimatedContainer animation="fadeInUp" delay={200} style={styles.actionSection}>
        <SearchBox
          searchTerm={searchTerm}
          setSearchTerm={handleSearch}
          onSearch={() => {}}
          placeholder="Pesquisar por nome, email ou telefone"
          style={styles.searchBox}
        />
        
        <CustomButton
          title="Novo Cliente"
          onPress={() => setIsAddModalOpen(true)}
          variant="primary"
          size="medium"
          style={styles.addButton}
        />
      </AnimatedContainer>

      {/* Clients List */}
      <AnimatedContainer animation="fadeInUp" delay={400} style={styles.listContainer}>
        {filteredClientes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>
              {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchTerm 
                ? 'Tente pesquisar com outros termos' 
                : 'Comece adicionando seu primeiro cliente'
              }
            </Text>
            {!searchTerm && (
              <CustomButton
                title="Adicionar Primeiro Cliente"
                onPress={() => setIsAddModalOpen(true)}
                variant="outline"
                style={styles.emptyButton}
              />
            )}
          </View>
        ) : (
          <FlatList
            data={filteredClientes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <AnimatedContainer
                animation="fadeInUp"
                delay={index * 100}
                style={styles.clienteCard}
              >
                <ClienteList
                  clientes={[item]}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </AnimatedContainer>
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
          />
        )}
      </AnimatedContainer>

      {/* Modals */}
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
        onClose={() => setClienteToDelete(null)}
        cliente={clienteToDelete}
        onConfirm={handleDeleteConfirm}
      />
    </View>
  );
};

export default ClientesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  statsNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  actionSection: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
    alignItems: 'flex-end',
  },
  searchBox: {
    flex: 1,
  },
  addButton: {
    minWidth: 120,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  flatListContent: {
    paddingBottom: spacing.xl,
  },
  clienteCard: {
    marginBottom: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  emptyButton: {
    marginTop: spacing.md,
  },
});
