import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ItemFluxo = ({ item }) => {
  const corValor = item.tipo === 'entrada' ? '#4CAF50' : '#F44336';
  const sinal = item.tipo === 'entrada' ? '+' : '-';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.descricao}>{item.descricao}</Text>
        <Text style={[styles.valor, { color: corValor }]}>
          {sinal} R$ {Number(item.valor).toFixed(2).replace('.', ',')}
        </Text>
      </View>
      
      <View style={styles.detalhes}>
        <Text style={styles.data}>
          {format(new Date(item.data), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
        </Text>
        <Text style={styles.categoria}>
          {item.categoria}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  descricao: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  valor: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detalhes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  data: {
    fontSize: 14,
    color: '#757575',
  },
  categoria: {
    fontSize: 14,
    color: '#757575',
    fontStyle: 'italic',
  },
});

export default ItemFluxo;