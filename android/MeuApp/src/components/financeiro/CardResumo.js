import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CardResumo = ({ titulo, valor, cor, icone }) => {
  return (
    <View style={[styles.card, { backgroundColor: '#fff' }]}>
      <Text style={styles.icone}>{icone}</Text>
      <Text style={styles.titulo}>{titulo}</Text>
      <Text style={[styles.valor, { color: cor }]}>
        R$ {valor.toFixed(2).replace('.', ',')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    alignItems: 'center',
  },
  icone: {
    fontSize: 24,
    marginBottom: 8,
  },
  titulo: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 8,
  },
  valor: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CardResumo;