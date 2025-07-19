import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../utils/colors';

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'pendente':
      return colors.warning;
    case 'processando':
      return colors.primary;
    case 'concluído':
    case 'concluido':
      return colors.success;
    case 'cancelado':
      return colors.error;
    default:
      return colors.textSecondary;
  }
};

const PedidoCard = ({ pedido, onEdit, onDelete }) => {
  const calcularTotal = () => {
    return pedido.produtos?.reduce((total, produto) => {
      return total + (produto.preco * produto.quantidade);
    }, 0) || 0;
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.clienteInfo}>
          <Text style={styles.clienteLabel}>Cliente</Text>
          <Text style={styles.clienteNome}>{pedido.cliente?.nome || 'Cliente não informado'}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(pedido.status) }]}>
          <Text style={styles.statusText}>{pedido.status || 'Pendente'}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Data</Text>
          <Text style={styles.infoValue}>
            {pedido.data ? new Date(pedido.data).toLocaleDateString('pt-BR') : 'Não informada'}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Total</Text>
          <Text style={styles.totalValue}>R$ {calcularTotal().toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.produtosSection}>
        <Text style={styles.produtosLabel}>
          Produtos ({pedido.produtos?.length || 0})
        </Text>
        {pedido.produtos && pedido.produtos.length > 0 ? (
          <View style={styles.produtosList}>
            {pedido.produtos.slice(0, 3).map((produto, index) => (
              <Text key={index} style={styles.produtoItem}>
                • {produto.nome} (x{produto.quantidade})
              </Text>
            ))}
            {pedido.produtos.length > 3 && (
              <Text style={styles.moreProducts}>
                +{pedido.produtos.length - 3} produtos...
              </Text>
            )}
          </View>
        ) : (
          <Text style={styles.noProdutos}>Nenhum produto adicionado</Text>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit} style={[styles.actionButton, styles.editButton]}>
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={[styles.actionButton, styles.deleteButton]}>
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.md,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  clienteInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  clienteLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  clienteNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  produtosSection: {
    marginBottom: spacing.lg,
  },
  produtosLabel: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  produtosList: {
    gap: spacing.xs,
  },
  produtoItem: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  moreProducts: {
    fontSize: 13,
    color: colors.primary,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  noProdutos: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: colors.primary,
  },
  deleteButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.error,
  },
  editButtonText: {
    color: colors.surface,
    fontWeight: '600',
    fontSize: 14,
  },
  deleteButtonText: {
    color: colors.error,
    fontWeight: '600',
    fontSize: 14,
  },
});

export default PedidoCard;
