import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import api from '../../api/axiosConfig';
import ItemFluxo from './ItemFluxo';

const FluxoCaixa = () => {
  const [fluxo, setFluxo] = useState([]);

  useEffect(() => {
    const fetchFluxo = async () => {
      try {
        const response = await api.get('/financeiro/fluxo-caixa');
        setFluxo(response.data);
      } catch (error) {
        console.error('Erro ao buscar fluxo de caixa:', error);
      }
    };

    fetchFluxo();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fluxo de Caixa</Text>
      
      <FlatList
        data={fluxo}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ItemFluxo item={item} />
        )}
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
});

export default FluxoCaixa;