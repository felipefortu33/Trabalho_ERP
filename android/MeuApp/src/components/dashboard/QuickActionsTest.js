// src/components/dashboard/QuickActionsTest.js
import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../utils/colors';

const QuickActionsTest = ({ navigation, onNewOrder }) => {
  const testNavigation = (screenName) => {
    try {
      console.log(`Tentando navegar para: ${screenName}`);
      if (navigation && navigation.navigate) {
        navigation.navigate(screenName);
      } else {
        Alert.alert('Erro', `Navigation não está disponível para ${screenName}`);
      }
    } catch (error) {
      console.error(`Erro ao navegar para ${screenName}:`, error);
      Alert.alert('Erro', `Falha ao navegar para ${screenName}: ${error.message}`);
    }
  };

  const testNewOrder = () => {
    try {
      console.log('Tentando abrir modal de novo pedido');
      if (onNewOrder && typeof onNewOrder === 'function') {
        onNewOrder();
      } else {
        Alert.alert('Erro', 'Função onNewOrder não está disponível');
      }
    } catch (error) {
      console.error('Erro ao abrir modal de novo pedido:', error);
      Alert.alert('Erro', `Falha ao abrir modal: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teste de Ações Rápidas</Text>
      
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.info }]}
        onPress={() => testNavigation('Clientes')}
      >
        <Ionicons name="people-outline" size={20} color={colors.textWhite} />
        <Text style={styles.buttonText}>Clientes</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.tertiary }]}
        onPress={() => testNavigation('Produtos')}
      >
        <Ionicons name="cube-outline" size={20} color={colors.textWhite} />
        <Text style={styles.buttonText}>Produtos</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.success }]}
        onPress={() => testNavigation('Pedidos')}
      >
        <Ionicons name="document-text-outline" size={20} color={colors.textWhite} />
        <Text style={styles.buttonText}>Pedidos</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={testNewOrder}
      >
        <Ionicons name="add-circle-outline" size={20} color={colors.textWhite} />
        <Text style={styles.buttonText}>Novo Pedido</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.warning }]}
        onPress={() => testNavigation('Financeiro')}
      >
        <Ionicons name="card-outline" size={20} color={colors.textWhite} />
        <Text style={styles.buttonText}>Financeiro</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  buttonText: {
    color: colors.textWhite,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
});

export default QuickActionsTest;
