// src/screens/DashboardScreen.js
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  Alert, 
  RefreshControl,
  Dimensions
} from 'react-native';
import StatCard from '../components/dashboard/StatCard';
import RecentPedidos from '../components/dashboard/RecentPedidos';
import QuickActions from '../components/dashboard/QuickActions';
import AddPedidoModal from '../components/pedidos/AddPedidoModal';
import AnimatedContainer from '../components/common/AnimatedContainer';
import api from '../api/axiosConfig';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { colors, spacing, borderRadius } from '../utils/colors';

const DashboardScreen = () => {
  const [stats, setStats] = useState(null);
  const [recentPedidos, setRecentPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const navigation = useNavigation();
  const { width } = Dimensions.get('window');
  const isTablet = width > 768;

  const fetchData = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const [statsRes, pedidosRes, clientesRes, produtosRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/pedidos?limit=5'),
        api.get('/clientes'),
        api.get('/produtos'),
      ]);
      setStats(statsRes.data);
      setRecentPedidos(pedidosRes.data);
      setClientes(clientesRes.data);
      setProdutos(produtosRes.data);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível carregar os dados do dashboard');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
    >
      {/* Header Section */}
      <AnimatedContainer animation="fadeInUp" style={styles.headerSection}>
        <Text style={styles.welcomeText}>Bem-vindo ao</Text>
        <Text style={styles.title}>Painel de Controle</Text>
        <Text style={styles.subtitle}>Visão geral do seu negócio</Text>
      </AnimatedContainer>

      {/* Stats Cards */}
      <AnimatedContainer animation="fadeInUp" delay={200}>
        <View style={[styles.statsContainer, isTablet && styles.statsTablet]}>
          <StatCard 
            title="Clientes" 
            value={stats?.totalClientes || 0} 
            color={colors.info}
            icon="people-outline"
          />
          <StatCard 
            title="Pedidos (Mês)" 
            value={stats?.totalPedidos || 0} 
            color={colors.success}
            icon="document-text-outline"
          />
          <StatCard 
            title="Produtos" 
            value={stats?.totalProdutos || 0} 
            color={colors.tertiary}
            icon="cube-outline"
          />
          <StatCard 
            title="Vendas (Mês)" 
            value={`R$ ${Number(stats?.vendasMes || 0).toFixed(2)}`} 
            color={colors.success}
            icon="cash-outline"
          />
          <StatCard 
            title="Pendentes" 
            value={stats?.pedidosPendentes || 0} 
            color={colors.warning}
            icon="time-outline"
          />
        </View>
      </AnimatedContainer>

      {/* Recent Orders */}
      <AnimatedContainer animation="fadeInUp" delay={400}>
        <RecentPedidos pedidos={recentPedidos} onRefresh={fetchData} />
      </AnimatedContainer>

      {/* Quick Actions */}
      <AnimatedContainer animation="fadeInUp" delay={600}>
        <QuickActions 
          navigation={navigation}
          onNewOrder={() => setShowAddModal(true)}
        />
      </AnimatedContainer>

      {/* Add Order Modal */}
      <AddPedidoModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onRefresh={fetchData}
        clientes={clientes}
        produtos={produtos}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
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
  headerSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingVertical: spacing.lg,
  },
  welcomeText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  statsTablet: {
    justifyContent: 'space-around',
  },
});

export default DashboardScreen;
