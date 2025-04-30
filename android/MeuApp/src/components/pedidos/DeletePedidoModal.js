import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';
import api from '../../api/axiosConfig';

const DeletePedidoModal = ({ pedido, onClose, onConfirm }) => {
  const handleDelete = async () => {
    try {
      await api.delete(`/pedidos/${pedido.id}`);
      onClose();
      onConfirm();
    } catch (error) {
      console.error('Erro ao excluir pedido:', error);
    }
  };

  if (!pedido) return null;

  return (
    <Modal visible={!!pedido} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Excluir Pedido</Text>
          <Text>Deseja realmente excluir o pedido do cliente {pedido.cliente.nome}?</Text>
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
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000088' },
  modal: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  buttons: { marginTop: 20 }
});

export default DeletePedidoModal;
