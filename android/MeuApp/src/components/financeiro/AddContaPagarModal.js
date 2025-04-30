import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import api from '../../api/axiosConfig';

const AddContaPagarModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    data_vencimento: '',
    fornecedor: '',
    categoria: '',
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await api.post('/financeiro/contas-pagar', {
        ...formData,
        valor: parseFloat(formData.valor),
      });
      onSuccess();  // Atualiza a lista no componente pai
      onClose();    // Fecha o modal
    } catch (error) {
      console.error('Erro ao adicionar conta a pagar:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Adicionar Conta a Pagar</Text>

          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={styles.input}
            value={formData.descricao}
            onChangeText={(text) => handleChange('descricao', text)}
            placeholder="Descrição"
          />

          <Text style={styles.label}>Valor</Text>
          <TextInput
            style={styles.input}
            value={formData.valor}
            onChangeText={(text) => handleChange('valor', text)}
            placeholder="Valor"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Data de Vencimento</Text>
          <TextInput
            style={styles.input}
            value={formData.data_vencimento}
            onChangeText={(text) => handleChange('data_vencimento', text)}
            placeholder="Data de Vencimento"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Fornecedor</Text>
          <TextInput
            style={styles.input}
            value={formData.fornecedor}
            onChangeText={(text) => handleChange('fornecedor', text)}
            placeholder="Fornecedor"
          />

          <Text style={styles.label}>Categoria</Text>
          <TextInput
            style={styles.input}
            value={formData.categoria}
            onChangeText={(text) => handleChange('categoria', text)}
            placeholder="Categoria"
          />

          <View style={styles.modalActions}>
            <TouchableOpacity onPress={handleSubmit} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AddContaPagarModal;
