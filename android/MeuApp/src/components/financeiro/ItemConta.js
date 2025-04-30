import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ItemConta = ({ item, tipo, onPagar }) => {
  const statusColor = item.status === 'pago' ? '#4CAF50' : '#F44336';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.descricao}>
          {tipo === 'receber' ? item.cliente_nome || 'Conta a Receber' : item.descricao}
        </Text>
        <Text style={[styles.status, { color: statusColor }]}>
          {item.status === 'pago' ? 'Pago' : 'Pendente'}
        </Text>
      </View>

      <View style={styles.detalhes}>
        <Text style={styles.valor}>R$ {Number(item.valor).toFixed(2).replace('.', ',')}</Text>
        <Text style={styles.data}>
          {format(new Date(item.data_vencimento), 'dd/MM/yyyy', { locale: ptBR })}
        </Text>
      </View>

      {item.status !== 'pago' && (
        <TouchableOpacity style={styles.botaoPagar} onPress={onPagar}>
          <Text style={styles.botaoTexto}>Marcar como Pago</Text>
        </TouchableOpacity>
      )}
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
  status: {
    fontSize: 14,
    fontWeight: '600',
  },
  detalhes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  valor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  data: {
    fontSize: 14,
    color: '#757575',
  },
  botaoPagar: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default ItemConta;
