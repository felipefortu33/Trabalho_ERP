// src/components/clientes/ClienteForm.js
import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ClienteForm = ({ cliente, onChange, onSubmit, onCancel }) => {
  return (
    <View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={cliente.nome}
          onChangeText={(text) => onChange({ ...cliente, nome: text })}
          placeholder="Nome"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Contato</Text>
        <TextInput
          style={styles.input}
          value={cliente.contato}
          onChangeText={(text) => onChange({ ...cliente, contato: text })}
          placeholder="Contato"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={cliente.email}
          onChangeText={(text) => onChange({ ...cliente, email: text })}
          placeholder="Email"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Endereço</Text>
        <TextInput
          style={styles.input}
          value={cliente.endereco}
          onChangeText={(text) => onChange({ ...cliente, endereco: text })}
          placeholder="Endereço"
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.saveButton} onPress={onSubmit}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ClienteForm;

const styles = StyleSheet.create({
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
