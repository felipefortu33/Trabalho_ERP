// src/screens/DashboardScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  Alert, 
  RefreshControl,
  Dimensions,
  BackHandler
} from 'react-native';
import StatCard from '../components/dashboard/StatCard';
import RecentPedidos from '../components/dashboard/RecentPedidos';
import QuickActions from '../components/dashboard/QuickActions';
import AddPedidoModal from '../components/pedidos/AddPedidoModal';
import AnimatedContainer from '../components/common/AnimatedContainer';
import api from '../api/axiosConfig';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { colors, spacing, borderRadius, shadows } from '../utils/colors';

const DashboardScreen = () => {
  const [stats, setStats] = useState(null);
  const [recentPedidos, setRecentPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const navigation = useNavigation();
  const { width, height } = Dimensions.get('window');
  const isTablet = width > 768;

  const fetchData = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      // Apenas as APIs que realmente existem no seu backend
      const [
        pedidosRes, 
        clientesRes, 
        produtosRes,
        resumoFinanceiroRes
      ] = await Promise.all([
        api.get('/pedidos'),
        api.get('/clientes'),
        api.get('/produtos'),
        api.get('/financeiro/resumo-financeiro').catch(() => ({ data: null })) // Opcional
      ]);
      
      // Calcular estatísticas baseado nos dados reais
      const pedidos = pedidosRes.data || [];
      const clientes = clientesRes.data || [];
      const produtos = produtosRes.data || [];
      const resumoFinanceiro = resumoFinanceiroRes.data;
      
      // Pedidos recentes (últimos 5)
      const recentePedidos = pedidos.slice(-5).reverse();
      
      // Estatísticas calculadas
      const agora = new Date();
      const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
      
      const pedidosDoMes = pedidos.filter(p => 
        new Date(p.data) >= inicioMes
      );
      
      const pedidosPendentes = pedidos.filter(p => 
        p.status?.toLowerCase() === 'pendente'
      ).length;
      
      const vendasMes = pedidosDoMes.reduce((total, p) => 
        total + (parseFloat(p.total) || 0), 0
      );
      
      const statsCalculadas = {
        totalClientes: clientes.length,
        totalPedidos: pedidosDoMes.length,
        totalProdutos: produtos.length,
        vendasMes: vendasMes,
        pedidosPendentes: pedidosPendentes,
        ...resumoFinanceiro // Inclui dados do financeiro se disponível
      };
      
      setStats(statsCalculadas);
      setRecentPedidos(recentePedidos);
      setClientes(clientes);
      setProdutos(produtos);
      
    } catch (err) {
      console.log('Erro ao carregar dados:', err.message);
      
      // Fallback com dados básicos vazios
      setStats({
        totalClientes: 0,
        totalPedidos: 0,
        totalProdutos: 0,
        vendasMes: 0,
        pedidosPendentes: 0
      });
      setRecentPedidos([]);
      setClientes([]);
      setProdutos([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData(false);
  }, []);

  const handleStatCardPress = useCallback((screen) => {
    navigation.navigate(screen);
  }, [navigation]);

  // Handle back button
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          "Sair do App",
          "Deseja realmente sair?",
          [
            { text: "Cancelar", style: "cancel" },
            { text: "Sair", onPress: () => BackHandler.exitApp() }
          ]
        );
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription?.remove();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
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

      {/* Stats Cards - Dados Reais */}
      <AnimatedContainer animation="fadeInUp" delay={200}>
        <View style={[styles.statsContainer, isTablet && styles.statsTablet]}>
          <StatCard 
            title="Clientes" 
            value={stats?.totalClientes || 0} 
            color={colors.info}
            icon="people-outline"
            onPress={() => handleStatCardPress('Clientes')}
          />
          <StatCard 
            title="Pedidos (Mês)" 
            value={stats?.totalPedidos || 0} 
            color={colors.success}
            icon="document-text-outline"
            onPress={() => handleStatCardPress('Pedidos')}
          />
          <StatCard 
            title="Produtos" 
            value={stats?.totalProdutos || 0} 
            color={colors.tertiary}
            icon="cube-outline"
            onPress={() => handleStatCardPress('Produtos')}
          />
          <StatCard 
            title="Vendas (Mês)" 
            value={`R$ ${Number(stats?.vendasMes || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
            color={colors.success}
            icon="cash-outline"
            onPress={() => handleStatCardPress('Financeiro')}
          />
          <StatCard 
            title="Pendentes" 
            value={stats?.pedidosPendentes || 0} 
            color={stats?.pedidosPendentes > 0 ? colors.warning : colors.success}
            icon="time-outline"
            onPress={() => handleStatCardPress('Pedidos')}
          />
        </View>
      </AnimatedContainer>

      {/* Recent Orders - Dados Reais */}
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
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
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
