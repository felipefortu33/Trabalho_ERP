// src/screens/DashboardScreen.js (completo com AddPedidoModal funcional)
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import StatCard from '../components/dashboard/StatCard';
import RecentPedidos from '../components/dashboard/RecentPedidos';
import AddPedidoModal from '../components/pedidos/AddPedidoModal'; // você já tem este
import api from '../api/axiosConfig';
import { useNavigation } from '@react-navigation/native';

const DashboardScreen = () => {
  const [stats, setStats] = useState(null);
  const [recentPedidos, setRecentPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const navigation = useNavigation();

  const fetchData = async () => {
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="green" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.statsContainer}>
        <StatCard title="Clientes" value={stats?.totalClientes} color="#6c757d" />
        <StatCard title="Pedidos (Mês)" value={stats?.totalPedidos} color="#28a745" />
        <StatCard title="Produtos" value={stats?.totalProdutos} color="#6c757d" />
        <StatCard title="Vendas (Mês)" value={`R$ ${Number(stats?.vendasMes || 0).toFixed(2)}`} color="#28a745" />
        <StatCard title="Pendentes" value={stats?.pedidosPendentes} color="#dc3545" />
      </View>

      <RecentPedidos pedidos={recentPedidos} />

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Clientes')}>
          <Text style={styles.actionText}>Gerenciar Clientes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Pedidos')}>
          <Text style={styles.actionText}>Gerenciar Pedidos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Produtos')}>
          <Text style={styles.actionText}>Gerenciar Produtos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => setShowAddModal(true)}>
          <Text style={styles.actionText}>Novo Pedido</Text>
        </TouchableOpacity>
      </View>

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
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, alignSelf: 'center' },
  statsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  actions: { marginTop: 20 },
  actionButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  actionText: { color: '#fff', fontWeight: 'bold' },
});

export default DashboardScreen;
