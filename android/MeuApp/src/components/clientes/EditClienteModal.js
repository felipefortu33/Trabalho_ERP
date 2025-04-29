// src/components/clientes/EditClienteModal.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal'; // (já usamos no AddClienteModal)
import api from '../../api/axiosConfig'; // ajuste se necessário

const EditClienteModal = ({ isVisible, onClose, cliente, onClienteUpdated }) => {
  const [editedCliente, setEditedCliente] = useState({
    id: '',
    nome: '',
    contato: '',
    email: '',
    endereco: '',
  });

  useEffect(() => {
    if (cliente) {
      setEditedCliente(cliente);
    }
  }, [cliente]);

  const handleInputChange = (field, value) => {
    setEditedCliente((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateCliente = async () => {
    try {
      await api.put(`/clientes/${editedCliente.id}`, editedCliente);
      onClienteUpdated();
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Editar Cliente</Text>

        <TextInput
          placeholder="Nome"
          style={styles.input}
          value={editedCliente.nome}
          onChangeText={(text) => handleInputChange('nome', text)}
        />
        <TextInput
          placeholder="Contato"
          style={styles.input}
          value={editedCliente.contato}
          onChangeText={(text) => handleInputChange('contato', text)}
        />
        <TextInput
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={editedCliente.email}
          onChangeText={(text) => handleInputChange('email', text)}
        />
        <TextInput
          placeholder="Endereço"
          style={styles.input}
          value={editedCliente.endereco}
          onChangeText={(text) => handleInputChange('endereco', text)}
        />

        <View style={styles.actions}>
          <TouchableOpacity style={styles.button} onPress={handleUpdateCliente}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default EditClienteModal;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
