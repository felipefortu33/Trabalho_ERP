import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import api from '../../api/axiosConfig';
import AddContaPagarModal from './AddContaPagarModal';
import PagarContaModal from './PagarContaModal';

const ContasPagar = () => {
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [contaToPay, setContaToPay] = useState(null);

  useEffect(() => {
    fetchContasPagar();
  }, []);

  const fetchContasPagar = async () => {
    try {
      const response = await api.get('/financeiro/contas-pagar');
      setContas(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar contas a pagar:', error);
      setLoading(false);
    }
  };

  const handlePagarConta = (conta) => {
    setContaToPay(conta);
  };

  if (loading) return <Text style={styles.loading}>Carregando...</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Contas a Pagar</Text>
        <Button title="Adicionar Conta" onPress={() => setIsAddModalOpen(true)} />
      </View>

      <FlatList
        data={contas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.contaRow, { backgroundColor: item.status === 'pendente' ? '#FFF' : '#f0f0f0' }]}>
            <Text>{item.fornecedor_nome || 'N/A'}</Text>
            <Text>{item.referencia || 'N/A'}</Text>
            <Text>R$ {Number(item.valor).toFixed(2)}</Text>
            <Text>{new Date(item.data_vencimento).toLocaleDateString()}</Text>
            <Text>{item.status === 'pendente' ? 'Pendente' : item.status === 'pago' ? 'Pago' : 'Atrasado'}</Text>
            {item.status === 'pendente' && (
              <TouchableOpacity onPress={() => handlePagarConta(item)} style={styles.button}>
                <Text style={styles.buttonText}>Registrar Pagamento</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      <AddContaPagarModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchContasPagar}
      />

      {contaToPay && (
        <PagarContaModal
          isOpen={!!contaToPay}
          onClose={() => setContaToPay(null)}
          conta={contaToPay}
          tipo="pagar"
          onSuccess={fetchContasPagar}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  loading: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  contaRow: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default ContasPagar;
