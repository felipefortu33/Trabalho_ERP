import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';
import api from '../../api/axiosConfig';

const DeleteProdutoModal = ({ produto, onClose, onConfirm }) => {
  const handleDelete = async () => {
    try {
      await api.delete(`/produtos/${produto.id}`);
      onClose();
      onConfirm();
    } catch (error) {
      console.error('Erro ao excluir produto', error);
    }
  };

  if (!produto) return null;

  return (
    <Modal visible={!!produto} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Excluir Produto</Text>
          <Text>Tem certeza que deseja excluir "{produto.nome}"?</Text>
          <View style={styles.buttons}>
            <Button title="Confirmar" onPress={handleDelete} color="green" />
            <Button title="Cancelar" onPress={onClose} color="gray" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000aa' },
  modal: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  buttons: { marginTop: 20 }
});

export default DeleteProdutoModal;
