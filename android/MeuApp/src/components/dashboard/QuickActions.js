// src/components/dashboard/QuickActions.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../common/CustomButton';
import { colors, spacing, borderRadius } from '../../utils/colors';

const QuickActions = ({ navigation, onNewOrder }) => {
  const { width } = Dimensions.get('window');
  const isTablet = width > 768;

  const actions = [
    {
      title: 'Gerenciar Clientes',
      icon: 'people-outline',
      action: () => navigation.navigate('Clientes'),
      variant: 'primary',
    },
    {
      title: 'Gerenciar Produtos',
      icon: 'cube-outline',
      action: () => navigation.navigate('Produtos'),
      variant: 'secondary',
    },
    {
      title: 'Ver Pedidos',
      icon: 'document-text-outline',
      action: () => navigation.navigate('Pedidos'),
      variant: 'outline',
    },
    {
      title: 'Novo Pedido',
      icon: 'add-circle-outline',
      action: onNewOrder,
      variant: 'primary',
    },
    {
      title: 'Financeiro',
      icon: 'card-outline',
      action: () => navigation.navigate('Financeiro'),
      variant: 'outline',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ações Rápidas</Text>
      <Text style={styles.subtitle}>Acesse rapidamente as principais funcionalidades</Text>
      
      <View style={[styles.actionsGrid, isTablet && styles.actionsGridTablet]}>
        {actions.map((action, index) => (
          <View 
            key={action.title} 
            style={[
              styles.actionContainer,
              { width: isTablet ? '32%' : '48%' }
            ]}
          >
            <CustomButton
              title=""
              onPress={action.action}
              variant={action.variant}
              style={styles.actionButton}
            />
            <View style={styles.actionIconContainer}>
              <Ionicons 
                name={action.icon} 
                size={28} 
                color={action.variant === 'outline' ? colors.primary : colors.textWhite} 
              />
            </View>
            <Text style={styles.actionTitle}>{action.title}</Text>
          </View>
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
  actionContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    position: 'relative',
  },
  actionButton: {
    width: '100%',
    minHeight: 80,
    borderRadius: borderRadius.lg,
  },
  actionIconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 16,
  },
});

export default QuickActions;
