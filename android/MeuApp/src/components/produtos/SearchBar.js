import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const SearchBar = ({ value, onChangeText, onSearch }) => (
  <View style={styles.container}>
    <TextInput
      placeholder="Buscar produto"
      value={value}
      onChangeText={onChangeText}
      style={styles.input}
    />
    <Button title="Buscar" color="green" onPress={onSearch} />
  </View>
);

const styles = StyleSheet.create({
  container: { flexDirection: 'row', marginBottom: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginRight: 10, paddingHorizontal: 10 }
});

export default SearchBar;
