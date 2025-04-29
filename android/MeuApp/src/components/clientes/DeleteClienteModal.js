// src/components/clientes/DeleteClienteModal.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal'; // já estamos usando para todos os modais

const DeleteClienteModal = ({ isVisible, cliente, onClose, onConfirm }) => {
  if (!cliente) return null;

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Confirmar Exclusão</Text>

        <Text style={styles.message}>
          Tem certeza que deseja excluir o cliente "{cliente.nome}"?
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={onConfirm}>
            <Text style={styles.buttonText}>Confirmar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteClienteModal;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  message: {
    fontSize: 16,
    marginBottom: 25,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  confirmButton: {
    backgroundColor: '#dc3545',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
