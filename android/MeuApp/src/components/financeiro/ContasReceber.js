import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import api from '../../api/axiosConfig';
import ItemConta from './ItemConta';
import PagarContaModal from './PagarContaModal';

const ContasReceber = () => {
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contaToPagar, setContaToPagar] = useState(null);

  const fetchContas = async () => {
    try {
      const response = await api.get('/financeiro/contas-receber');
      setContas(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar contas a receber:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContas();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contas a Receber</Text>

      <FlatList
        data={contas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ItemConta
            item={item}
            tipo="receber"
            onPagar={() => setContaToPagar(item)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma conta a receber encontrada.</Text>
        }
      />

      <PagarContaModal
        visible={!!contaToPagar}
        onClose={() => setContaToPagar(null)}
        conta={contaToPagar}
        tipo="receber"
        onSuccess={fetchContas}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 32,
  },
});

export default ContasReceber;
