import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import ProdutoCard from '../components/produtos/ProdutoCard';
import AddProdutoModal from '../components/produtos/AddProdutoModal';
import EditProdutoModal from '../components/produtos/EditProdutoModal';
import DeleteProdutoModal from '../components/produtos/DeleteProdutoModal';
import SearchBar from '../components/produtos/SearchBar';
import api from '../api/axiosConfig';

const ProdutosScreen = () => {
  const [produtos, setProdutos] = useState([]);
  const [isAddVisible, setIsAddVisible] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [produtoParaExcluir, setProdutoParaExcluir] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProdutos = async () => {
    try {
      const response = await api.get('/produtos');
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos', error);
    }
  };

  const buscarProdutos = async () => {
    try {
      const response = await api.get(`/produtos/search?nome=${searchTerm}`);
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao buscar produto por nome', error);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestão de Produtos</Text>

      <SearchBar
        value={searchTerm}
        onChangeText={setSearchTerm}
        onSearch={buscarProdutos}
      />

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProdutoCard
            produto={item}
            onEdit={() => setProdutoEditando(item)}
            onDelete={() => setProdutoParaExcluir(item)}
          />
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setIsAddVisible(true)}>
        <Text style={styles.addButtonText}>Adicionar Produto</Text>
      </TouchableOpacity>

      <AddProdutoModal visible={isAddVisible} onClose={() => setIsAddVisible(false)} onRefresh={fetchProdutos} />
      <EditProdutoModal produto={produtoEditando} onClose={() => setProdutoEditando(null)} onRefresh={fetchProdutos} />
      <DeleteProdutoModal produto={produtoParaExcluir} onClose={() => setProdutoParaExcluir(null)} onConfirm={fetchProdutos} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  addButton: { backgroundColor: 'green', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  addButtonText: { color: '#fff', fontWeight: 'bold' }
});

export default ProdutosScreen;
