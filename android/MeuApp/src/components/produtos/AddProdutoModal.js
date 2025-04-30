import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';
import api from '../../api/axiosConfig';

const AddProdutoModal = ({ visible, onClose, onRefresh }) => {
  const [produto, setProduto] = useState({ nome: '', descricao: '', categoria: '', preco: '', estoque: '' });

  const handleAdd = async () => {
    try {
      await api.post('/produtos', produto);
      onClose();
      onRefresh();
      setProduto({ nome: '', descricao: '', categoria: '', preco: '', estoque: '' });
    } catch (error) {
      console.error('Erro ao adicionar produto', error);
    }
  };
  

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modal}>
        <Text style={styles.title}>Adicionar Produto</Text>
        <TextInput style={styles.input} placeholder="Nome" value={produto.nome} onChangeText={v => setProduto({ ...produto, nome: v })} />
        <TextInput style={styles.input} placeholder="Descrição" value={produto.descricao} onChangeText={v => setProduto({ ...produto, descricao: v })} />
        <TextInput style={styles.input} placeholder="Categoria" value={produto.categoria} onChangeText={v => setProduto({ ...produto, categoria: v })} />
        <TextInput style={styles.input} placeholder="Preço" keyboardType="numeric" value={produto.preco} onChangeText={v => setProduto({ ...produto, preco: v })} />
        <TextInput style={styles.input} placeholder="Estoque" keyboardType="numeric" value={produto.estoque} onChangeText={v => setProduto({ ...produto, estoque: v })} />

        <Button title="Salvar" onPress={handleAdd} color="green" />
        <Button title="Cancelar" onPress={onClose} color="gray" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: { borderBottomWidth: 1, marginBottom: 10, padding: 8 }
});

export default AddProdutoModal;
