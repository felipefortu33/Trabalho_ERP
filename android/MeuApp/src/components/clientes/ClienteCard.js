// src/components/clientes/ClienteCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../../utils/colors';

const ClienteCard = ({ 
  cliente, 
  onPress, 
  onEdit, 
  onDelete, 
  isSelected = false, 
  isMultiSelectMode = false,
  onToggleSelect,
  viewMode = 'card'
}) => {
  const getInitials = (nome) => {
    return nome
      .split(' ')
      .map(word => word.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data não informada';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  const isRecent = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return date >= thirtyDaysAgo;
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        viewMode === 'list' && styles.listMode,
        isSelected && styles.selected,
        isMultiSelectMode && styles.multiSelectMode
      ]}
      onPress={onPress}
      onLongPress={onToggleSelect}
      activeOpacity={0.7}
    >
      {/* Checkbox para seleção múltipla */}
      {isMultiSelectMode && (
        <TouchableOpacity 
          style={styles.checkbox}
          onPress={onToggleSelect}
        >
          <Ionicons
            name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
            size={24}
            color={isSelected ? colors.primary : colors.textTertiary}
          />
        </TouchableOpacity>
      )}

      {/* Avatar */}
      <View style={[
        styles.avatar,
        isRecent(cliente.created_at || cliente.criado_em) && styles.avatarRecent
      ]}>
        <Text style={styles.avatarText}>
          {getInitials(cliente.nome)}
        </Text>
        {isRecent(cliente.created_at || cliente.criado_em) && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>N</Text>
          </View>
        )}
      </View>

      {/* Informações do cliente */}
      <View style={styles.clienteInfo}>
        <View style={styles.headerRow}>
          <Text style={styles.nome} numberOfLines={1}>
            {cliente.nome}
          </Text>
          {cliente.status === 'vip' && (
            <Ionicons name="star" size={16} color={colors.warning} />
          )}
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.email} numberOfLines={1}>
            {cliente.email}
          </Text>
        </View>

        {cliente.contato && (
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.contato} numberOfLines={1}>
              {cliente.contato}
            </Text>
          </View>
        )}

        {viewMode === 'card' && cliente.endereco && (
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.endereco} numberOfLines={1}>
              {cliente.endereco}
            </Text>
          </View>
        )}

        {viewMode === 'card' && (
          <View style={styles.metaInfo}>
            <Text style={styles.metaText}>
              Cadastrado em {formatDate(cliente.created_at || cliente.criado_em)}
            </Text>
            {cliente.ultimo_pedido && (
              <Text style={styles.metaText}>
                Último pedido: {formatDate(cliente.ultimo_pedido)}
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Ações */}
      {!isMultiSelectMode && (
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={() => onEdit(cliente)}
          >
            <Ionicons name="pencil" size={16} color={colors.success} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => onDelete(cliente)}
          >
            <Ionicons name="trash-outline" size={16} color={colors.error} />
          </TouchableOpacity>
        </View>
      )}

      {/* Indicador de status */}
      {cliente.status && (
        <View style={[
          styles.statusIndicator,
          cliente.status === 'ativo' && styles.statusAtivo,
          cliente.status === 'inativo' && styles.statusInativo,
          cliente.status === 'vip' && styles.statusVip
        ]} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    ...shadows.sm,
    position: 'relative',
  },
  listMode: {
    paddingVertical: spacing.md,
  },
  selected: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  multiSelectMode: {
    paddingLeft: spacing.md,
  },
  checkbox: {
    marginRight: spacing.md,
    padding: spacing.xs,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    position: 'relative',
  },
  avatarRecent: {
    backgroundColor: colors.success,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  newBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.warning,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  clienteInfo: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  nome: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  contato: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  endereco: {
    fontSize: 14,
    color: colors.textTertiary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  metaInfo: {
    marginTop: spacing.sm,
  },
  metaText: {
    fontSize: 12,
    color: colors.textTertiary,
    lineHeight: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  editButton: {
    backgroundColor: colors.success + '20',
  },
  deleteButton: {
    backgroundColor: colors.error + '20',
  },
  statusIndicator: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusAtivo: {
    backgroundColor: colors.success,
  },
  statusInativo: {
    backgroundColor: colors.textTertiary,
  },
  statusVip: {
    backgroundColor: colors.warning,
  },
});

export default ClienteCard;
