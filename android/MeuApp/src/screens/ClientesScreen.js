import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  FlatList, 
  RefreshControl,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axiosConfig';
import ClienteCard from '../components/clientes/ClienteCard';
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
  
  // Novos estados para melhorias
  const [sortBy, setSortBy] = useState('nome'); // nome, data, email
  const [sortOrder, setSortOrder] = useState('asc'); // asc, desc
  const [filterBy, setFilterBy] = useState('todos'); // todos, ativos, recentes
  const [viewMode, setViewMode] = useState('card'); // card, list
  const [showFilters, setShowFilters] = useState(false);
  const [clienteStats, setClienteStats] = useState({
    total: 0,
    novos: 0,
    ativos: 0
  });
  const [selectedClientes, setSelectedClientes] = useState([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [showClienteDetails, setShowClienteDetails] = useState(false);
  const [clienteDetalhado, setClienteDetalhado] = useState(null);
  const [showGestaoModal, setShowGestaoModal] = useState(false);

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
      const clientesData = response.data;
      setClientes(clientesData);
      
      // Calcular estatísticas
      const hoje = new Date();
      const umMesAtras = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const stats = {
        total: clientesData.length,
        novos: clientesData.filter(c => {
          const dataCriacao = c.created_at || c.criado_em;
          return dataCriacao && new Date(dataCriacao) >= umMesAtras;
        }).length,
        ativos: clientesData.filter(c => c.status !== 'inativo').length
      };
      setClienteStats(stats);
      
      // Aplicar filtros após carregar os dados
      applyFiltersAndSort(searchTerm, filterBy, sortBy, sortOrder, clientesData);
      
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
    applyFiltersAndSort(term, filterBy, sortBy, sortOrder);
  };

  const applyFiltersAndSort = (searchTerm = '', filter = filterBy, sort = sortBy, order = sortOrder, clientesData = clientes) => {
    let filtered = [...clientesData];

    // Aplicar busca
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(cliente => 
        cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cliente.telefone && cliente.telefone.includes(searchTerm)) ||
        (cliente.contato && cliente.contato.includes(searchTerm))
      );
    }

    // Aplicar filtros
    if (filter === 'recentes') {
      const umMesAtras = new Date();
      umMesAtras.setMonth(umMesAtras.getMonth() - 1);
      filtered = filtered.filter(c => {
        const dataCriacao = c.created_at || c.criado_em;
        return dataCriacao && new Date(dataCriacao) >= umMesAtras;
      });
    } else if (filter === 'ativos') {
      filtered = filtered.filter(c => c.status !== 'inativo');
    }

    // Aplicar ordenação
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sort === 'nome') {
        comparison = a.nome.localeCompare(b.nome);
      } else if (sort === 'email') {
        comparison = a.email.localeCompare(b.email);
      } else if (sort === 'data') {
        const dateA = new Date(a.created_at || a.criado_em || '1970-01-01');
        const dateB = new Date(b.created_at || b.criado_em || '1970-01-01');
        comparison = dateA - dateB;
      }
      return order === 'asc' ? comparison : -comparison;
    });

    setFilteredClientes(filtered);
  };

  const handleSort = (field) => {
    const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(field);
    setSortOrder(newOrder);
    applyFiltersAndSort(searchTerm, filterBy, field, newOrder);
  };

  const handleFilter = (filter) => {
    setFilterBy(filter);
    applyFiltersAndSort(searchTerm, filter, sortBy, sortOrder);
  };

  const toggleMultiSelect = () => {
    setIsMultiSelectMode(!isMultiSelectMode);
    setSelectedClientes([]);
  };

  const toggleClienteSelection = (cliente) => {
    if (selectedClientes.find(c => c.id === cliente.id)) {
      setSelectedClientes(selectedClientes.filter(c => c.id !== cliente.id));
    } else {
      setSelectedClientes([...selectedClientes, cliente]);
    }
  };

  const deleteMultipleClientes = async () => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja excluir ${selectedClientes.length} cliente(s) selecionado(s)?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await Promise.all(
                selectedClientes.map(cliente => 
                  api.delete(`/clientes/${cliente.id}`)
                )
              );
              
              const updatedClientes = clientes.filter(c => 
                !selectedClientes.find(sc => sc.id === c.id)
              );
              setClientes(updatedClientes);
              setFilteredClientes(updatedClientes);
              setSelectedClientes([]);
              setIsMultiSelectMode(false);
              Alert.alert('Sucesso', `${selectedClientes.length} cliente(s) excluído(s) com sucesso!`);
            } catch (error) {
              console.error('Erro ao excluir clientes:', error);
              Alert.alert('Erro', 'Erro ao excluir alguns clientes.');
            }
          }
        }
      ]
    );
  };

  const exportClientes = () => {
    // Simular exportação - em um app real, isso geraria um arquivo
    Alert.alert(
      'Exportar Clientes',
      `Exportando ${filteredClientes.length} cliente(s) para CSV...`,
      [{ text: 'OK' }]
    );
  };

  const viewClienteDetails = async (cliente) => {
    try {
      // Buscar detalhes completos do cliente (pedidos, histórico, etc.)
      const [pedidosRes, contasRes] = await Promise.all([
        api.get(`/pedidos?cliente_id=${cliente.id}`).catch(() => ({ data: [] })),
        api.get(`/financeiro/contas-receber?cliente_id=${cliente.id}`).catch(() => ({ data: [] }))
      ]);

      const clienteCompleto = {
        ...cliente,
        pedidos: pedidosRes.data || [],
        contas: contasRes.data || [],
        totalPedidos: pedidosRes.data?.length || 0,
        valorTotal: (contasRes.data || []).reduce((sum, conta) => sum + parseFloat(conta.valor || 0), 0)
      };

      setClienteDetalhado(clienteCompleto);
      setShowClienteDetails(true);
    } catch (error) {
      console.error('Erro ao buscar detalhes do cliente:', error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes do cliente.');
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
      
      // Recalcular estatísticas
      const hoje = new Date();
      const umMesAtras = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const stats = {
        total: updatedClientes.length,
        novos: updatedClientes.filter(c => {
          const dataCriacao = c.created_at || c.criado_em;
          return dataCriacao && new Date(dataCriacao) >= umMesAtras;
        }).length,
        ativos: updatedClientes.filter(c => c.status !== 'inativo').length
      };
      setClienteStats(stats);
      
      // Aplicar filtros com dados atualizados
      applyFiltersAndSort(searchTerm, filterBy, sortBy, sortOrder, updatedClientes);
      
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
        <AnimatedContainer animation="pulse" style={styles.loadingContent}>
          <LoadingSpinner size={40} color={colors.primary} />
          <Text style={styles.loadingText}>Carregando clientes...</Text>
          <Text style={styles.loadingSubtext}>Aguarde um momento</Text>
        </AnimatedContainer>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      
      {/* Header Simplificado */}
      <AnimatedContainer animation="fadeInUp" style={styles.headerSimple}>
        <View style={styles.headerSimpleContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.titleSimple}>Clientes</Text>
            <Text style={styles.subtitleSimple}>
              {filteredClientes.length} cliente{filteredClientes.length !== 1 ? 's' : ''}
            </Text>
          </View>
          
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.gestaoButton}
              onPress={() => setShowGestaoModal(true)}
            >
              <Ionicons name="settings-outline" size={24} color={colors.primary} />
              <Text style={styles.gestaoButtonText}>Gestão</Text>
              {(filterBy !== 'todos' || sortBy !== 'nome' || isMultiSelectMode) && (
                <View style={styles.gestaoNotificationBadge}>
                  <View style={styles.gestaoNotificationDot} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </AnimatedContainer>

      {/* Search Section */}
      <AnimatedContainer animation="fadeInUp" delay={200} style={styles.searchSection}>
        <SearchBox
          searchTerm={searchTerm}
          setSearchTerm={handleSearch}
          onSearch={() => {}}
          placeholder="Pesquisar por nome, email ou telefone"
          style={styles.searchBox}
        />
        
        {/* Filtros Ativos Indicator */}
        {(filterBy !== 'todos' || sortBy !== 'nome' || searchTerm) && (
          <View style={styles.activeFiltersContainer}>
            <View style={styles.activeFilters}>
              {filterBy !== 'todos' && (
                <View style={styles.activeFilter}>
                  <Text style={styles.activeFilterText}>
                    {filterBy === 'recentes' ? 'Recentes' : 'Ativos'}
                  </Text>
                  <TouchableOpacity onPress={() => handleFilter('todos')}>
                    <Ionicons name="close" size={16} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              )}
              {sortBy !== 'nome' && (
                <View style={styles.activeFilter}>
                  <Text style={styles.activeFilterText}>
                    {sortBy === 'email' ? 'Por Email' : 'Por Data'}
                  </Text>
                  <TouchableOpacity onPress={() => handleSort('nome')}>
                    <Ionicons name="close" size={16} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              )}
              {searchTerm && (
                <View style={styles.activeFilter}>
                  <Text style={styles.activeFilterText} numberOfLines={1}>
                    "{searchTerm.length > 15 ? searchTerm.substring(0, 15) + '...' : searchTerm}"
                  </Text>
                  <TouchableOpacity onPress={() => handleSearch('')}>
                    <Ionicons name="close" size={16} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <TouchableOpacity 
              style={styles.clearAllFilters}
              onPress={() => {
                handleSearch('');
                handleFilter('todos');
                handleSort('nome');
              }}
            >
              <Text style={styles.clearAllFiltersText}>Limpar tudo</Text>
            </TouchableOpacity>
          </View>
        )}
      </AnimatedContainer>

      {/* Action Buttons Section */}
      <AnimatedContainer animation="fadeInUp" delay={250} style={styles.actionButtonsSection}>
        {isMultiSelectMode && selectedClientes.length > 0 ? (
          <View style={styles.multiSelectActions}>
            <View style={styles.multiSelectInfo}>
              <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              <Text style={styles.multiSelectText}>
                {selectedClientes.length} cliente{selectedClientes.length !== 1 ? 's' : ''} selecionado{selectedClientes.length !== 1 ? 's' : ''}
              </Text>
            </View>
            <View style={styles.multiSelectButtons}>
              <CustomButton
                title="Excluir"
                onPress={deleteMultipleClientes}
                variant="outline"
                size="small"
                style={[styles.multiSelectButton, { borderColor: colors.error }]}
                textStyle={{ color: colors.error }}
              />
              <CustomButton
                title="Exportar"
                onPress={exportClientes}
                variant="outline"
                size="small"
                style={styles.multiSelectButton}
              />
              <CustomButton
                title="Cancelar"
                onPress={toggleMultiSelect}
                variant="secondary"
                size="small"
                style={styles.multiSelectButton}
              />
            </View>
          </View>
        ) : filteredClientes.length === 0 && !searchTerm ? (
          // Não mostrar o botão quando lista está vazia
          null
        ) : (
          <View style={styles.primaryActions}>
            <CustomButton
              title="+ Novo Cliente"
              onPress={() => setIsAddModalOpen(true)}
              variant="primary"
              size="large"
              style={styles.addButton}
              icon="person-add-outline"
            />
          </View>
        )}
      </AnimatedContainer>

      {/* Floating Action Button - alternativa compacta */}
      {!isMultiSelectMode && filteredClientes.length > 0 && (
        <AnimatedContainer animation="bounceIn" delay={600} style={styles.fabContainer}>
          <TouchableOpacity 
            style={styles.floatingActionButton}
            onPress={() => setIsAddModalOpen(true)}
            activeOpacity={0.8}
          >
            <View style={styles.fabInner}>
              <Ionicons name="add" size={28} color={colors.textWhite} />
            </View>
          </TouchableOpacity>
        </AnimatedContainer>
      )}

      {/* Clients List */}
      <AnimatedContainer animation="fadeInUp" delay={400} style={styles.listContainer}>
        {filteredClientes.length === 0 ? (
          <AnimatedContainer animation="fadeInUp" delay={300} style={styles.emptyContainer}>
            <AnimatedContainer animation="bounceIn" delay={500}>
              <Ionicons name="people-outline" size={64} color={colors.textTertiary} />
            </AnimatedContainer>
            <AnimatedContainer animation="fadeInUp" delay={600}>
              <Text style={styles.emptyTitle}>
                {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
              </Text>
            </AnimatedContainer>
            <AnimatedContainer animation="fadeInUp" delay={700}>
              <Text style={styles.emptySubtitle}>
                {searchTerm 
                  ? 'Tente pesquisar com outros termos ou ajustar os filtros' 
                  : 'Comece adicionando seu primeiro cliente ao sistema'
                }
              </Text>
            </AnimatedContainer>
            {!searchTerm && (
              <AnimatedContainer animation="fadeInUp" delay={800}>
                <CustomButton
                  title="Adicionar Primeiro Cliente"
                  onPress={() => setIsAddModalOpen(true)}
                  variant="outline"
                  style={styles.emptyButton}
                  icon="person-add-outline"
                />
              </AnimatedContainer>
            )}
            {searchTerm && (
              <AnimatedContainer animation="fadeInUp" delay={800}>
                <TouchableOpacity 
                  style={styles.clearSearchButton}
                  onPress={() => handleSearch('')}
                >
                  <Ionicons name="refresh-outline" size={20} color={colors.primary} />
                  <Text style={styles.clearSearchText}>Limpar pesquisa</Text>
                </TouchableOpacity>
              </AnimatedContainer>
            )}
          </AnimatedContainer>
        ) : (
          <FlatList
            data={filteredClientes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <AnimatedContainer
                animation="fadeInUp"
                delay={Math.min(index * 30, 300)} // Limita o delay máximo
                style={styles.clienteCard}
              >
                <ClienteCard
                  cliente={item}
                  viewMode={viewMode}
                  isMultiSelectMode={isMultiSelectMode}
                  isSelected={selectedClientes.find(c => c.id === item.id)}
                  onPress={() => {
                    if (isMultiSelectMode) {
                      toggleClienteSelection(item);
                    } else {
                      viewClienteDetails(item);
                    }
                  }}
                  onToggleSelect={() => toggleClienteSelection(item)}
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

      {/* Modal de Detalhes do Cliente */}
      <Modal
        visible={showClienteDetails}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalhes do Cliente</Text>
            <TouchableOpacity onPress={() => setShowClienteDetails(false)}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
          
          {clienteDetalhado && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.clienteDetailCard}>
                <View style={styles.clienteDetailHeader}>
                  <View style={styles.clienteDetailAvatar}>
                    <Text style={styles.clienteDetailAvatarText}>
                      {clienteDetalhado.nome.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.clienteDetailInfo}>
                    <Text style={styles.clienteDetailNome}>{clienteDetalhado.nome}</Text>
                    <Text style={styles.clienteDetailEmail}>{clienteDetalhado.email}</Text>
                  </View>
                </View>
                
                <View style={styles.clienteDetailStats}>
                  <View style={styles.detailStatCard}>
                    <Text style={styles.detailStatNumber}>{clienteDetalhado.totalPedidos}</Text>
                    <Text style={styles.detailStatLabel}>Pedidos</Text>
                  </View>
                  <View style={styles.detailStatCard}>
                    <Text style={styles.detailStatNumber}>
                      R$ {clienteDetalhado.valorTotal.toFixed(2)}
                    </Text>
                    <Text style={styles.detailStatLabel}>Valor Total</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.clienteDetailSection}>
                <Text style={styles.sectionTitle}>Informações de Contato</Text>
                <View style={styles.infoRow}>
                  <Ionicons name="call-outline" size={20} color={colors.textSecondary} />
                  <Text style={styles.infoText}>{clienteDetalhado.contato || 'Não informado'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={20} color={colors.textSecondary} />
                  <Text style={styles.infoText}>{clienteDetalhado.endereco || 'Não informado'}</Text>
                </View>
              </View>
              
              {clienteDetalhado.pedidos && clienteDetalhado.pedidos.length > 0 && (
                <View style={styles.clienteDetailSection}>
                  <Text style={styles.sectionTitle}>Pedidos Recentes</Text>
                  {clienteDetalhado.pedidos.slice(-3).map(pedido => (
                    <View key={pedido.id} style={styles.pedidoItem}>
                      <View style={styles.pedidoInfo}>
                        <Text style={styles.pedidoId}>Pedido #{pedido.id}</Text>
                        <Text style={styles.pedidoData}>
                          {new Date(pedido.data || pedido.created_at).toLocaleDateString()}
                        </Text>
                      </View>
                      <Text style={styles.pedidoValor}>
                        R$ {parseFloat(pedido.total || 0).toFixed(2)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
              
              <View style={styles.modalActions}>
                <CustomButton
                  title="Editar Cliente"
                  onPress={() => {
                    setShowClienteDetails(false);
                    handleEdit(clienteDetalhado);
                  }}
                  variant="primary"
                  style={styles.modalActionButton}
                />
                <CustomButton
                  title="Novo Pedido"
                  onPress={() => {
                    setShowClienteDetails(false);
                    navigation.navigate('Pedidos', { clienteId: clienteDetalhado.id });
                  }}
                  variant="outline"
                  style={styles.modalActionButton}
                />
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* Modal de Gestão */}
      <Modal
        visible={showGestaoModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.gestaoModalContainer}>
          <View style={styles.gestaoModalHeader}>
            <Text style={styles.gestaoModalTitle}>Gestão de Clientes</Text>
            <TouchableOpacity onPress={() => setShowGestaoModal(false)}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.gestaoModalContent}>
            {/* Stats Cards */}
            <View style={styles.gestaoStatsSection}>
              <Text style={styles.gestaoSectionTitle}>Estatísticas</Text>
              <View style={styles.gestaoStatsGrid}>
                <View style={styles.gestaoStatsCard}>
                  <Ionicons name="people-outline" size={32} color={colors.primary} />
                  <Text style={styles.gestaoStatsNumber}>{clienteStats.total}</Text>
                  <Text style={styles.gestaoStatsLabel}>Total de Clientes</Text>
                </View>
                
                <View style={styles.gestaoStatsCard}>
                  <Ionicons name="person-add-outline" size={32} color={colors.success} />
                  <Text style={[styles.gestaoStatsNumber, { color: colors.success }]}>{clienteStats.novos}</Text>
                  <Text style={styles.gestaoStatsLabel}>Novos (30 dias)</Text>
                </View>
                
                <View style={styles.gestaoStatsCard}>
                  <Ionicons name="checkmark-circle-outline" size={32} color={colors.info} />
                  <Text style={[styles.gestaoStatsNumber, { color: colors.info }]}>{clienteStats.ativos}</Text>
                  <Text style={styles.gestaoStatsLabel}>Clientes Ativos</Text>
                </View>
              </View>
            </View>

            {/* Configurações de Visualização */}
            <View style={styles.gestaoSection}>
              <Text style={styles.gestaoSectionTitle}>Visualização</Text>
              <View style={styles.gestaoOptionsGrid}>
                <TouchableOpacity 
                  style={[styles.gestaoOption, viewMode === 'card' && styles.gestaoOptionActive]}
                  onPress={() => setViewMode('card')}
                >
                  <Ionicons 
                    name="grid-outline" 
                    size={24} 
                    color={viewMode === 'card' ? colors.primary : colors.textSecondary} 
                  />
                  <Text style={[
                    styles.gestaoOptionText,
                    viewMode === 'card' && styles.gestaoOptionTextActive
                  ]}>
                    Cards
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.gestaoOption, viewMode === 'list' && styles.gestaoOptionActive]}
                  onPress={() => setViewMode('list')}
                >
                  <Ionicons 
                    name="list-outline" 
                    size={24} 
                    color={viewMode === 'list' ? colors.primary : colors.textSecondary} 
                  />
                  <Text style={[
                    styles.gestaoOptionText,
                    viewMode === 'list' && styles.gestaoOptionTextActive
                  ]}>
                    Lista
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.gestaoOption, isMultiSelectMode && styles.gestaoOptionActive]}
                  onPress={toggleMultiSelect}
                >
                  <Ionicons 
                    name="checkmark-circle-outline" 
                    size={24} 
                    color={isMultiSelectMode ? colors.primary : colors.textSecondary} 
                  />
                  <Text style={[
                    styles.gestaoOptionText,
                    isMultiSelectMode && styles.gestaoOptionTextActive
                  ]}>
                    Seleção Múltipla
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Filtros */}
            <View style={styles.gestaoSection}>
              <Text style={styles.gestaoSectionTitle}>Filtros</Text>
              <View style={styles.gestaoFiltersGrid}>
                <TouchableOpacity 
                  style={[styles.gestaoFilter, filterBy === 'todos' && styles.gestaoFilterActive]}
                  onPress={() => handleFilter('todos')}
                >
                  <Text style={[
                    styles.gestaoFilterText,
                    filterBy === 'todos' && styles.gestaoFilterTextActive
                  ]}>
                    Todos
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.gestaoFilter, filterBy === 'recentes' && styles.gestaoFilterActive]}
                  onPress={() => handleFilter('recentes')}
                >
                  <Text style={[
                    styles.gestaoFilterText,
                    filterBy === 'recentes' && styles.gestaoFilterTextActive
                  ]}>
                    Recentes
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.gestaoFilter, filterBy === 'ativos' && styles.gestaoFilterActive]}
                  onPress={() => handleFilter('ativos')}
                >
                  <Text style={[
                    styles.gestaoFilterText,
                    filterBy === 'ativos' && styles.gestaoFilterTextActive
                  ]}>
                    Ativos
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Ordenação */}
            <View style={styles.gestaoSection}>
              <Text style={styles.gestaoSectionTitle}>Ordenação</Text>
              <View style={styles.gestaoSortGrid}>
                <TouchableOpacity 
                  style={[styles.gestaoSort, sortBy === 'nome' && styles.gestaoSortActive]}
                  onPress={() => handleSort('nome')}
                >
                  <Text style={[
                    styles.gestaoSortText,
                    sortBy === 'nome' && styles.gestaoSortTextActive
                  ]}>
                    Nome
                  </Text>
                  {sortBy === 'nome' && (
                    <Ionicons 
                      name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'} 
                      size={16} 
                      color={colors.primary} 
                    />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.gestaoSort, sortBy === 'email' && styles.gestaoSortActive]}
                  onPress={() => handleSort('email')}
                >
                  <Text style={[
                    styles.gestaoSortText,
                    sortBy === 'email' && styles.gestaoSortTextActive
                  ]}>
                    Email
                  </Text>
                  {sortBy === 'email' && (
                    <Ionicons 
                      name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'} 
                      size={16} 
                      color={colors.primary} 
                    />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.gestaoSort, sortBy === 'data' && styles.gestaoSortActive]}
                  onPress={() => handleSort('data')}
                >
                  <Text style={[
                    styles.gestaoSortText,
                    sortBy === 'data' && styles.gestaoSortTextActive
                  ]}>
                    Data
                  </Text>
                  {sortBy === 'data' && (
                    <Ionicons 
                      name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'} 
                      size={16} 
                      color={colors.primary} 
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Ações */}
            <View style={styles.gestaoSection}>
              <Text style={styles.gestaoSectionTitle}>Ações</Text>
              <View style={styles.gestaoActionsGrid}>
                <TouchableOpacity 
                  style={styles.gestaoAction}
                  onPress={() => {
                    setShowGestaoModal(false);
                    exportClientes();
                  }}
                >
                  <Ionicons name="download-outline" size={24} color={colors.primary} />
                  <Text style={styles.gestaoActionText}>Exportar CSV</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.gestaoAction}
                  onPress={() => {
                    setShowGestaoModal(false);
                    // Implementar importação futuramente
                  }}
                >
                  <Ionicons name="cloud-upload-outline" size={24} color={colors.primary} />
                  <Text style={styles.gestaoActionText}>Importar</Text>
                </TouchableOpacity>
                
                {selectedClientes.length > 0 && (
                  <TouchableOpacity 
                    style={[styles.gestaoAction, { borderColor: colors.error }]}
                    onPress={() => {
                      setShowGestaoModal(false);
                      deleteMultipleClientes();
                    }}
                  >
                    <Ionicons name="trash-outline" size={24} color={colors.error} />
                    <Text style={[styles.gestaoActionText, { color: colors.error }]}>
                      Excluir Selecionados ({selectedClientes.length})
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

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
  loadingContent: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  loadingSubtext: {
    marginTop: spacing.xs,
    fontSize: 14,
    color: colors.textTertiary,
  },
  header: {
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  headerSimple: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    ...shadows.sm,
  },
  headerSimpleContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  titleSimple: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitleSimple: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  gestaoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary + '15',
    borderRadius: borderRadius.md,
    gap: spacing.xs,
    position: 'relative',
  },
  gestaoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  gestaoNotificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
  },
  gestaoNotificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
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
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background,
  },
  iconButtonActive: {
    backgroundColor: colors.primary,
  },
  statsContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  statsCard: {
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
    minWidth: 80,
    ...shadows.xs,
  },
  statsNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: spacing.xs,
  },
  statsLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  filtersContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterSection: {
    marginBottom: spacing.md,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    marginRight: spacing.sm,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  filterButtonTextActive: {
    color: colors.textWhite,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    marginRight: spacing.sm,
    gap: spacing.xs,
  },
  sortButtonActive: {
    backgroundColor: colors.primary,
  },
  sortButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  sortButtonTextActive: {
    color: colors.textWhite,
  },
  actionSection: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
    alignItems: 'flex-end',
  },
  searchSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  searchBox: {
    marginBottom: 0,
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  activeFilters: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  activeFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
  },
  activeFilterText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  clearAllFilters: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  clearAllFiltersText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  actionButtonsSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  primaryActions: {
    gap: spacing.md,
  },
  addButton: {
    width: '100%',
    paddingVertical: spacing.md,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
    marginTop: spacing.sm,
  },
  secondaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  secondaryActionText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  multiSelectActions: {
    gap: spacing.md,
  },
  multiSelectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primary + '10',
    borderRadius: borderRadius.md,
  },
  multiSelectText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  multiSelectButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  multiSelectButton: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    minWidth: 80,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  flatListContent: {
    paddingBottom: spacing.xl,
  },
  clienteCard: {
    // Removido margem pois agora está no ClienteCard
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
  clearSearchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary + '10',
    borderRadius: borderRadius.md,
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  clearSearchText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  clienteDetailCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginVertical: spacing.md,
    ...shadows.sm,
  },
  clienteDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  clienteDetailAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  clienteDetailAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  clienteDetailInfo: {
    flex: 1,
  },
  clienteDetailNome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  clienteDetailEmail: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  clienteDetailStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailStatCard: {
    alignItems: 'center',
  },
  detailStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  detailStatLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  clienteDetailSection: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: spacing.md,
  },
  pedidoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  pedidoInfo: {
    flex: 1,
  },
  pedidoId: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  pedidoData: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  pedidoValor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.success,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  modalActionButton: {
    flex: 1,
  },
  gestaoModalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gestaoModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.sm,
  },
  gestaoModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  gestaoModalContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  gestaoSection: {
    marginVertical: spacing.md,
  },
  gestaoStatsSection: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  gestaoSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  gestaoStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  gestaoStatsCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  gestaoStatsNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: spacing.sm,
  },
  gestaoStatsLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  gestaoOptionsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  gestaoOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  gestaoOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  gestaoOptionText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  gestaoOptionTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  gestaoFiltersGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  gestaoFilter: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  gestaoFilterActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  gestaoFilterText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  gestaoFilterTextActive: {
    color: colors.textWhite,
    fontWeight: '600',
  },
  gestaoSortGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  gestaoSort: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  gestaoSortActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  gestaoSortText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  gestaoSortTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  gestaoActionsGrid: {
    gap: spacing.sm,
  },
  gestaoAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  gestaoActionText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  floatingActionButton: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    elevation: 8,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 999,
  },
  fabContainer: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    zIndex: 999,
  },
  fabInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
