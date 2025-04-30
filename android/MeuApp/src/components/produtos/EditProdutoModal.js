import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';
import api from '../../api/axiosConfig';

const EditProdutoModal = ({ produto, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    categoria: '',
    preco: '',
    estoque: ''
  });

  useEffect(() => {
    if (produto) {
      setFormData({
        nome: produto.nome || '',
        descricao: produto.descricao || '',
        categoria: produto.categoria || '',
        preco: produto.preco.toString(),
        estoque: produto.estoque.toString()
      });
    }
  }, [produto]);

  const handleUpdate = async () => {
    try {
      await api.put(`/produtos/${produto.id}`, formData);
      onClose();
      onRefresh();
    } catch (error) {
      console.error('Erro ao atualizar produto', error);
    }
  };

  if (!produto) return null;

  return (
    <Modal visible={!!produto} animationType="slide">
      <View style={styles.modal}>
        <Text style={styles.title}>Editar Produto</Text>
        <TextInput style={styles.input} placeholder="Nome" value={formData.nome} onChangeText={v => setFormData({ ...formData, nome: v })} />
        <TextInput style={styles.input} placeholder="Descrição" value={formData.descricao} onChangeText={v => setFormData({ ...formData, descricao: v })} />
        <TextInput style={styles.input} placeholder="Categoria" value={formData.categoria} onChangeText={v => setFormData({ ...formData, categoria: v })} />
        <TextInput style={styles.input} placeholder="Preço" keyboardType="numeric" value={formData.preco} onChangeText={v => setFormData({ ...formData, preco: v })} />
        <TextInput style={styles.input} placeholder="Estoque" keyboardType="numeric" value={formData.estoque} onChangeText={v => setFormData({ ...formData, estoque: v })} />

        <Button title="Salvar Alterações" onPress={handleUpdate} color="green" />
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

export default EditProdutoModal;
