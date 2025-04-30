import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ProdutoCard = ({ produto, onEdit, onDelete }) => (
  <View style={styles.card}>
    <Text style={styles.nome}>{produto.nome}</Text>
    <Text>{produto.descricao}</Text>
    <Text>Categoria: {produto.categoria}</Text>
    <Text>Preço: R$ {produto.preco}</Text>
    <Text>Estoque: {produto.estoque}</Text>

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
  nome: { fontSize: 18, fontWeight: 'bold' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  edit: { backgroundColor: 'green', padding: 8, borderRadius: 5 },
  delete: { backgroundColor: 'red', padding: 8, borderRadius: 5 },
  btnText: { color: '#fff' }
});

export default ProdutoCard;
