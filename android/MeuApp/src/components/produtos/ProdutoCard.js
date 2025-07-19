import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../utils/colors';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const ProdutoCard = ({ produto, onEdit, onDelete }) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <Text style={styles.nome} numberOfLines={2}>{produto.nome}</Text>
      <View style={[styles.badge, produto.estoque <= 5 && styles.badgeWarning]}>
        <Text style={styles.badgeText}>{produto.estoque}</Text>
      </View>
    </View>
    
    <Text style={styles.descricao} numberOfLines={2}>{produto.descricao}</Text>
    <Text style={styles.categoria}>Categoria: {produto.categoria}</Text>
    
    <View style={styles.priceContainer}>
      <Text style={styles.priceLabel}>Preço</Text>
      <Text style={styles.price}>R$ {parseFloat(produto.preco).toFixed(2)}</Text>
    </View>
    
    <View style={styles.stockContainer}>
      <Text style={styles.stockLabel}>Estoque</Text>
      <Text style={[styles.stock, produto.estoque <= 5 && styles.stockLow]}>
        {produto.estoque} {produto.estoque === 1 ? 'unidade' : 'unidades'}
      </Text>
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.md,
    marginBottom: spacing.md,
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
    lineHeight: 24,
  },
  badge: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    minWidth: 32,
    alignItems: 'center',
  },
  badgeWarning: {
    backgroundColor: colors.warning,
  },
  badgeText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: 'bold',
  },
  descricao: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  categoria: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    fontStyle: 'italic',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  priceLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  stockContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  stockLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  stock: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
  },
  stockLow: {
    color: colors.warning,
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

export default ProdutoCard;
