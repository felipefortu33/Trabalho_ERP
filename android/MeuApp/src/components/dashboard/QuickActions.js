// src/components/dashboard/QuickActions.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../../utils/colors';

const QuickActions = ({ navigation, onNewOrder }) => {
  const { width } = Dimensions.get('window');
  const isTablet = width > 768;

  const actions = [
    {
      title: 'Gerenciar Clientes',
      icon: 'people-outline',
      action: () => {
        try {
          navigation.navigate('Clientes');
        } catch (error) {
          console.log('Erro ao navegar para Clientes:', error);
        }
      },
      color: colors.info,
    },
    {
      title: 'Gerenciar Produtos',
      icon: 'cube-outline',
      action: () => {
        try {
          navigation.navigate('Produtos');
        } catch (error) {
          console.log('Erro ao navegar para Produtos:', error);
        }
      },
      color: colors.tertiary,
    },
    {
      title: 'Ver Pedidos',
      icon: 'document-text-outline',
      action: () => {
        try {
          navigation.navigate('Pedidos');
        } catch (error) {
          console.log('Erro ao navegar para Pedidos:', error);
        }
      },
      color: colors.success,
    },
    {
      title: 'Novo Pedido',
      icon: 'add-circle-outline',
      action: () => {
        try {
          if (onNewOrder) onNewOrder();
        } catch (error) {
          console.log('Erro ao abrir modal de novo pedido:', error);
        }
      },
      color: colors.primary,
    },
    {
      title: 'Financeiro',
      icon: 'card-outline',
      action: () => {
        try {
          navigation.navigate('Financeiro');
        } catch (error) {
          console.log('Erro ao navegar para Financeiro:', error);
        }
      },
      color: colors.warning,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ações Rápidas</Text>
      <Text style={styles.subtitle}>Acesse rapidamente as principais funcionalidades</Text>
      
      <View style={[styles.actionsGrid, isTablet && styles.actionsGridTablet]}>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={action.title}
            style={[
              styles.actionButton,
              { 
                width: isTablet ? '19%' : '48%',
                backgroundColor: action.color,
              }
            ]}
            onPress={action.action}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={action.icon} 
              size={28} 
              color={colors.textWhite}
            />
            <Text style={styles.actionTitle}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionsGridTablet: {
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    minHeight: 80,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    ...shadows.sm,
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textWhite,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 16,
  },
});

export default QuickActions;
