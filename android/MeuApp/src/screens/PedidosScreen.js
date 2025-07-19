import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import PedidoCard from '../components/pedidos/PedidoCard';
import AddPedidoModal from '../components/pedidos/AddPedidoModal';
import EditPedidoModal from '../components/pedidos/EditPedidoModal';
import DeletePedidoModal from '../components/pedidos/DeletePedidoModal';
import CustomButton from '../components/common/CustomButton';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AnimatedContainer from '../components/common/AnimatedContainer';
import { colors, spacing, borderRadius, shadows } from '../utils/colors';
import api from '../api/axiosConfig';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const PedidosScreen = () => {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [isAddVisible, setIsAddVisible] = useState(false);
  const [pedidoEditando, setPedidoEditando] = useState(null);
  const [pedidoParaExcluir, setPedidoParaExcluir] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPedidos = async () => {
    try {
      const response = await api.get('/pedidos');
      setPedidos(response.data);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await api.get('/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  const fetchProdutos = async () => {
    try {
      const response = await api.get('/produtos');
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchPedidos(), fetchClientes(), fetchProdutos()]);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const renderEmptyState = () => (
    <AnimatedContainer delay={300} style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Nenhum pedido encontrado</Text>
      <Text style={styles.emptySubtitle}>
        Comece criando seu primeiro pedido{'\n'}
        para organizar suas vendas
      </Text>
      <CustomButton
        title="Criar Primeiro Pedido"
        onPress={() => setIsAddVisible(true)}
        style={styles.emptyButton}
      />
    </AnimatedContainer>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size="large" />
        <Text style={styles.loadingText}>Carregando pedidos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AnimatedContainer delay={100} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Gestão de Pedidos</Text>
          <Text style={styles.subtitle}>
            {pedidos.length} {pedidos.length === 1 ? 'pedido' : 'pedidos'} registrados
          </Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsNumber}>{pedidos.length}</Text>
        </View>
      </AnimatedContainer>

      <AnimatedContainer delay={200} style={styles.actionSection}>
        <CustomButton
          title="Novo Pedido"
          onPress={() => setIsAddVisible(true)}
          style={styles.addButton}
        />
      </AnimatedContainer>

      <AnimatedContainer delay={300} style={styles.listContainer}>
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <AnimatedContainer delay={400 + index * 100} style={styles.pedidoContainer}>
              <PedidoCard
                pedido={item}
                onEdit={() => setPedidoEditando(item)}
                onDelete={() => setPedidoParaExcluir(item)}
              />
            </AnimatedContainer>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={[
            styles.flatListContent,
            pedidos.length === 0 && { flex: 1 }
          ]}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      </AnimatedContainer>

      <AddPedidoModal
        visible={isAddVisible}
        onClose={() => setIsAddVisible(false)}
        onRefresh={() => {
          fetchPedidos();
          setIsAddVisible(false);
        }}
        clientes={clientes}
        produtos={produtos}
      />

      <EditPedidoModal
        visible={!!pedidoEditando}
        pedido={pedidoEditando}
        onClose={() => setPedidoEditando(null)}
        onRefresh={() => {
          fetchPedidos();
          setPedidoEditando(null);
        }}
        clientes={clientes}
        produtosDisponiveis={produtos}
      />

      <DeletePedidoModal
        pedido={pedidoParaExcluir}
        onClose={() => setPedidoParaExcluir(null)}
        onConfirm={() => {
          fetchPedidos();
          setPedidoParaExcluir(null);
        }}
      />
    </View>
  );
};

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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  addButton: {
    width: '100%',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  flatListContent: {
    paddingBottom: spacing.xl,
  },
  pedidoContainer: {
    marginBottom: spacing.md,
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

export default PedidosScreen;
