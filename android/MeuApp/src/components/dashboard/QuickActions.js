// src/components/dashboard/QuickActions.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const QuickActions = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Ações Rápidas</Text>
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Clientes')}>
      <Text style={styles.buttonText}>Clientes</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Pedidos')}>
      <Text style={styles.buttonText}>Pedidos</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Produtos')}>
      <Text style={styles.buttonText}>Produtos</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('NovoPedido')}>
      <Text style={styles.buttonText}>Novo Pedido</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { marginTop: 30 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  button: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default QuickActions;
