// src/components/clientes/AddClienteModal.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal'; // (instale: npm install react-native-modal)
import api from '../../api/axiosConfig'; // ajuste se necessário

const AddClienteModal = ({ isVisible, onClose, onClienteAdded }) => {
  const [newCliente, setNewCliente] = useState({
    nome: '',
    contato: '',
    email: '',
    endereco: '',
  });

  const handleInputChange = (field, value) => {
    setNewCliente((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCliente = async () => {
    try {
      await api.post('/clientes', newCliente);
      onClienteAdded();
      onClose();
      setNewCliente({ nome: '', contato: '', email: '', endereco: '' });
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
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
        <Text style={styles.title}>Adicionar Cliente</Text>

        <TextInput
          placeholder="Nome"
          style={styles.input}
          value={newCliente.nome}
          onChangeText={(text) => handleInputChange('nome', text)}
        />
        <TextInput
          placeholder="Contato"
          style={styles.input}
          value={newCliente.contato}
          onChangeText={(text) => handleInputChange('contato', text)}
        />
        <TextInput
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={newCliente.email}
          onChangeText={(text) => handleInputChange('email', text)}
        />
        <TextInput
          placeholder="Endereço"
          style={styles.input}
          value={newCliente.endereco}
          onChangeText={(text) => handleInputChange('endereco', text)}
        />

        <View style={styles.actions}>
          <TouchableOpacity style={styles.button} onPress={handleAddCliente}>
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

export default AddClienteModal;

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
