import React, { useState } from 'react';
import {
  Modal, View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../../api/axiosConfig';

const AddPedidoModal = ({ visible, onClose, onRefresh, clientes, produtos }) => {
  const [clienteId, setClienteId] = useState('');
  const [buscaProduto, setBuscaProduto] = useState('');
  const [produtosEncontrados, setProdutosEncontrados] = useState([]);
  const [quantidade, setQuantidade] = useState('1');
  const [pedidoProdutos, setPedidoProdutos] = useState([]);

  const buscarProdutos = () => {
    const encontrados = produtos.filter(p =>
      p.nome.toLowerCase().includes(buscaProduto.toLowerCase())
    );
    setProdutosEncontrados(encontrados);
  };

  const adicionarProduto = (produto) => {
    const jaExiste = pedidoProdutos.find(p => p.produto_id === produto.id);
    const precoNumerico = Number(produto.preco || 0);

    if (jaExiste) {
      setPedidoProdutos(pedidoProdutos.map(p =>
        p.produto_id === produto.id
          ? { ...p, quantidade: p.quantidade + parseInt(quantidade) }
          : p
      ));
    } else {
      setPedidoProdutos([...pedidoProdutos, {
        produto_id: produto.id,
        nome: produto.nome,
        preco: precoNumerico,
        quantidade: parseInt(quantidade)
      }]);
    }
    setBuscaProduto('');
    setProdutosEncontrados([]);
    setQuantidade('1');
  };

  const removerProduto = (id) => {
    setPedidoProdutos(pedidoProdutos.filter(p => p.produto_id !== id));
  };

  const calcularTotal = () => {
    return pedidoProdutos.reduce((total, p) => total + Number(p.preco) * p.quantidade, 0).toFixed(2);
  };

  const handleSalvar = async () => {
    if (!clienteId || pedidoProdutos.length === 0) {
      alert('Selecione um cliente e adicione produtos.');
      return;
    }

    try {
      await api.post('/pedidos/multiplos', {
        cliente_id: clienteId,
        produtos: pedidoProdutos.map(p => ({
          produto_id: p.produto_id,
          quantidade: p.quantidade
        }))
      });
      onRefresh();
      onClose();
      setClienteId('');
      setPedidoProdutos([]);
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar pedido.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Novo Pedido</Text>

        <Text style={styles.label}>Cliente</Text>
        <Picker
          selectedValue={clienteId}
          onValueChange={(value) => setClienteId(value)}
        >
          <Picker.Item label="Selecione um cliente" value="" />
          {clientes?.map(c => (
            <Picker.Item key={c.id} label={c.nome} value={c.id} />
          ))}
        </Picker>

        <Text style={styles.label}>Buscar Produto</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome"
          value={buscaProduto}
          onChangeText={setBuscaProduto}
          onBlur={buscarProdutos}
        />

        {produtosEncontrados.map((produto) => (
          <TouchableOpacity
            key={produto.id}
            style={styles.produtoItem}
            onPress={() => adicionarProduto(produto)}
          >
            <Text>{produto.nome} - R${Number(produto.preco || 0).toFixed(2)}</Text>
          </TouchableOpacity>
        ))}

        <TextInput
          style={styles.input}
          placeholder="Quantidade"
          keyboardType="numeric"
          value={quantidade}
          onChangeText={setQuantidade}
        />

        <Text style={styles.label}>Produtos no Pedido</Text>
        {pedidoProdutos.map((p) => (
          <View key={p.produto_id} style={styles.produtoItem}>
            <Text>{p.quantidade}x {p.nome} - R${(Number(p.preco) * p.quantidade).toFixed(2)}</Text>
            <Button title="Remover" onPress={() => removerProduto(p.produto_id)} />
          </View>
        ))}

        <Text style={styles.total}>Total: R${calcularTotal()}</Text>

        <Button title="Salvar Pedido" onPress={handleSalvar} color="green" />
        <Button title="Cancelar" onPress={onClose} color="red" />
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  label: { marginTop: 15, fontWeight: 'bold' },
  input: { borderBottomWidth: 1, marginBottom: 10, padding: 8 },
  produtoItem: { paddingVertical: 6, borderBottomWidth: 0.5 },
  total: { fontWeight: 'bold', fontSize: 16, marginVertical: 10 }
});

export default AddPedidoModal;
