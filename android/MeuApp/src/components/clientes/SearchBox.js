// src/components/clientes/SearchBox.js
import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons'; // Para o ícone de lupa

const SearchBox = ({ searchTerm, setSearchTerm, onSearch, placeholder }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={searchTerm}
        onChangeText={setSearchTerm}
        returnKeyType="search"
        onSubmitEditing={onSearch}
      />
      <TouchableOpacity style={styles.searchButton} onPress={onSearch}>
        <Feather name="search" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBox;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  input: {
    flex: 1,
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  searchButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
