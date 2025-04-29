// src/components/clientes/ClienteList.js
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // ícones nativos (expo install @expo/vector-icons)

const ClienteList = ({ clientes, onEdit, onDelete }) => {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.nome}>{item.nome}</Text>
      <Text style={styles.info}>Contato: {item.contato}</Text>
      <Text style={styles.info}>Email: {item.email}</Text>
      <Text style={styles.info}>Endereço: {item.endereco}</Text>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onEdit(item)} style={styles.editButton}>
          <Ionicons name="pencil" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onDelete(item)} style={styles.deleteButton}>
          <Ionicons name="trash" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (clientes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhum cliente cadastrado.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={clientes}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
    />
  );
};

export default ClienteList;

const styles = StyleSheet.create({
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  info: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 6,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
