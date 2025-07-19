// src/components/dashboard/RecentPedidos.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../../utils/colors';

const RecentPedidos = ({ pedidos, onRefresh }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pendente': return colors.warning;
      case 'concluído': return colors.success;
      case 'cancelado': return colors.error;
      default: return colors.tertiary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pendente': return 'time-outline';
      case 'concluído': return 'checkmark-circle-outline';
      case 'cancelado': return 'close-circle-outline';
      default: return 'ellipse-outline';
    }
  };

  if (!pedidos || pedidos.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Pedidos Recentes</Text>
          <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
            <Ionicons name="refresh-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={48} color={colors.textTertiary} />
          <Text style={styles.emptyText}>Nenhum pedido encontrado</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pedidos Recentes</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <Ionicons name="refresh-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {pedidos.map((pedido, index) => (
          <View key={pedido.id} style={[styles.card, { marginLeft: index === 0 ? 0 : spacing.md }]}>
            <View style={styles.cardHeader}>
              <View style={styles.pedidoInfo}>
                <Text style={styles.pedidoId}>#{pedido.id}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(pedido.status) + '20' }]}>
                  <Ionicons 
                    name={getStatusIcon(pedido.status)} 
                    size={12} 
                    color={getStatusColor(pedido.status)} 
                  />
                  <Text style={[styles.status, { color: getStatusColor(pedido.status) }]}>
                    {pedido.status}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.cardBody}>
              <Text style={styles.clienteName} numberOfLines={1}>
                {pedido.cliente?.nome || 'Cliente não informado'}
              </Text>
              <Text style={styles.date}>
                {new Date(pedido.data).toLocaleDateString('pt-BR')}
              </Text>
              {pedido.total && (
                <Text style={styles.total}>
                  R$ {Number(pedido.total).toFixed(2)}
                </Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  refreshButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    paddingRight: spacing.md,
  },
  card: {
    width: 200,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.sm,
  },
  cardHeader: {
    marginBottom: spacing.sm,
  },
  pedidoInfo: {
    flexDirection: 'column',
    gap: spacing.xs,
  },
  pedidoId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  cardBody: {
    gap: spacing.xs,
  },
  clienteName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  total: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.success,
    marginTop: spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textTertiary,
    marginTop: spacing.md,
  },
});

export default RecentPedidos;
