// PagarContaModal.js
import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import api from '../../api/axiosConfig';

const PagarContaModal = ({ visible, onClose, conta, tipo, onSuccess }) => {
  const [formData, setFormData] = useState({
    data_pagamento: '',
    forma_pagamento: '',
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await api.post(`/financeiro/contas-${tipo}/${conta.id}/pagar`, formData);
      onSuccess();  // atualiza lista
      onClose();    // fecha modal
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      Alert.alert('Erro', 'Não foi possível registrar o pagamento.');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Registrar Pagamento</Text>

          <Text style={styles.label}>Descrição:</Text>
          <Text style={styles.value}>{conta?.descricao || conta?.referencia}</Text>

          <Text style={styles.label}>Valor:</Text>
          <Text style={styles.value}>R$ {Number(conta?.valor).toFixed(2)}</Text>

          <Text style={styles.label}>Data do Pagamento</Text>
          <TextInput
            placeholder="YYYY-MM-DD"
            value={formData.data_pagamento}
            onChangeText={(text) => handleChange('data_pagamento', text)}
            style={styles.input}
          />

          <Text style={styles.label}>Forma de Pagamento</Text>
          <TextInput
            placeholder="Ex: Pix, Cartão"
            value={formData.forma_pagamento}
            onChangeText={(text) => handleChange('forma_pagamento', text)}
            style={styles.input}
          />

          <View style={styles.actions}>
            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
              <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '85%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontWeight: '500',
    marginTop: 10,
  },
  value: {
    marginBottom: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginTop: 5,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    marginRight: 0,
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PagarContaModal;
