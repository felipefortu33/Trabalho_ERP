// src/components/dashboard/RecentPedidos.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RecentPedidos = ({ pedidos }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Pedidos Recentes</Text>
    {pedidos.map(pedido => (
      <View key={pedido.id} style={styles.card}>
        <Text style={styles.info}>#{pedido.id} - {pedido.cliente?.nome}</Text>
        <Text style={styles.date}>{new Date(pedido.data).toLocaleDateString()}</Text>
        <Text style={[styles.status, { color: getStatusColor(pedido.status) }]}>{pedido.status}</Text>
      </View>
    ))}
  </View>
);

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'pendente': return '#dc3545';
    case 'concluído': return '#28a745';
    default: return '#6c757d';
  }
};

const styles = StyleSheet.create({
  container: { marginTop: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  card: {
    padding: 12,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    marginBottom: 8,
  },
  info: { fontSize: 16 },
  date: { fontSize: 14, color: '#666' },
  status: { fontSize: 16, fontWeight: 'bold' },
});

export default RecentPedidos;
