import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PedidosScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pedidos 🧾</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 22, fontWeight: 'bold' }
});

export default PedidosScreen;
