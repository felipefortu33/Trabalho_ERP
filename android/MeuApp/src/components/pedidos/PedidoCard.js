import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const PedidoCard = ({ pedido, onEdit, onDelete }) => (
  <View style={styles.card}>
    <Text style={styles.titulo}>Cliente: {pedido.cliente.nome}</Text>
    <Text>Status: {pedido.status}</Text>
    <Text>Data: {new Date(pedido.data).toLocaleDateString()}</Text>
    <Text>Produtos:</Text>
    {pedido.produtos.map((p, i) => (
      <Text key={i}>- {p.nome} (x{p.quantidade})</Text>
    ))}
    <View style={styles.actions}>
      <TouchableOpacity onPress={onEdit} style={styles.edit}>
        <Text style={styles.btnText}>Editar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete} style={styles.delete}>
        <Text style={styles.btnText}>Excluir</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: '#eee', padding: 15, marginBottom: 10, borderRadius: 10 },
  titulo: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  edit: { backgroundColor: 'green', padding: 8, borderRadius: 5 },
  delete: { backgroundColor: 'red', padding: 8, borderRadius: 5 },
  btnText: { color: '#fff' }
});

export default PedidoCard;
