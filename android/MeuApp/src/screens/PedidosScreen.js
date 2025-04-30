import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import PedidoCard from '../components/pedidos/PedidoCard';
import AddPedidoModal from '../components/pedidos/AddPedidoModal';
import EditPedidoModal from '../components/pedidos/EditPedidoModal';
import DeletePedidoModal from '../components/pedidos/DeletePedidoModal';
import api from '../api/axiosConfig';

const PedidosScreen = () => {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [isAddVisible, setIsAddVisible] = useState(false);
  const [pedidoEditando, setPedidoEditando] = useState(null);
  const [pedidoParaExcluir, setPedidoParaExcluir] = useState(null);

  const fetchPedidos = async () => {
    try {
      const response = await api.get('/pedidos');
      setPedidos(response.data);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await api.get('/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  const fetchProdutos = async () => {
    try {
      const response = await api.get('/produtos');
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  useEffect(() => {
    fetchPedidos();
    fetchClientes();
    fetchProdutos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestão de Pedidos</Text>

      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PedidoCard
            pedido={item}
            onEdit={() => setPedidoEditando(item)}
            onDelete={() => setPedidoParaExcluir(item)}
          />
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setIsAddVisible(true)}>
        <Text style={styles.addButtonText}>Novo Pedido</Text>
      </TouchableOpacity>

      <AddPedidoModal
        visible={isAddVisible}
        onClose={() => setIsAddVisible(false)}
        onRefresh={fetchPedidos}
        clientes={clientes}
        produtos={produtos}
      />

<EditPedidoModal
  visible={!!pedidoEditando}
  pedido={pedidoEditando}
  onClose={() => setPedidoEditando(null)}
  onRefresh={fetchPedidos}
  clientes={clientes}
  produtosDisponiveis={produtos} // Adicionado esta linha
/>

      <DeletePedidoModal
        pedido={pedidoParaExcluir}
        onClose={() => setPedidoParaExcluir(null)}
        onConfirm={fetchPedidos}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  addButton: { backgroundColor: 'green', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  addButtonText: { color: '#fff', fontWeight: 'bold' }
});

export default PedidosScreen;
