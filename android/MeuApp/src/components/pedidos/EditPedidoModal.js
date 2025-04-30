import React, { useEffect, useState } from 'react';
import {
  Modal, View, Text, TextInput, Button, StyleSheet, ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../../api/axiosConfig';

const EditPedidoModal = ({ visible, onClose, onRefresh, pedido, clientes, produtosDisponiveis }) => {
  const [clienteId, setClienteId] = useState('');
  const [status, setStatus] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [gerarContas, setGerarContas] = useState(false);
  const [parcelas, setParcelas] = useState('1');
  const [vencimento, setVencimento] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('');
  
  // Novos estados adicionados
  const [buscaProduto, setBuscaProduto] = useState('');
  const [produtosEncontrados, setProdutosEncontrados] = useState([]);
  const [quantidadeAdicionar, setQuantidadeAdicionar] = useState('1');

  useEffect(() => {
    if (pedido) {
      setClienteId(pedido.cliente.id.toString());
      setStatus(pedido.status || 'Pendente');
      setProdutos(
        pedido.produtos.map(p => ({
          produto_id: p.id,
          nome: p.nome,
          preco: Number(p.preco || 0),
          quantidade: p.quantidade
        }))
      );
      setGerarContas(
        pedido.status === 'Concluído' && (!pedido.contas_receber || pedido.contas_receber.length === 0)
      );
    }
  }, [pedido]);

  // Função para buscar produtos
  const buscarProdutos = () => {
    const encontrados = produtosDisponiveis.filter(p =>
      p.nome.toLowerCase().includes(buscaProduto.toLowerCase())
    );
    setProdutosEncontrados(encontrados);
  };

  // Função para adicionar produto
  const adicionarProduto = (produto) => {
    const jaExiste = produtos.find(p => p.produto_id === produto.id);
    const precoNumerico = Number(produto.preco || 0);
    const novaQuantidade = parseInt(quantidadeAdicionar) || 1;

    if (jaExiste) {
      setProdutos(produtos.map(p =>
        p.produto_id === produto.id
          ? { ...p, quantidade: p.quantidade + novaQuantidade }
          : p
      ));
    } else {
      setProdutos([...produtos, {
        produto_id: produto.id,
        nome: produto.nome,
        preco: precoNumerico,
        quantidade: novaQuantidade
      }]);
    }

    setBuscaProduto('');
    setProdutosEncontrados([]);
    setQuantidadeAdicionar('1');
  };

  const handleChangeQuantidade = (index, value) => {
    const atualizados = [...produtos];
    atualizados[index].quantidade = parseInt(value) || 1;
    setProdutos(atualizados);
  };

  const calcularTotal = () => {
    return produtos.reduce((total, p) => total + Number(p.preco) * p.quantidade, 0).toFixed(2);
  };

  const calcularVencimentos = (n, dataInicial) => {
    const datas = [];
    
    // Verifica se a data inicial é válida
    if (!dataInicial || isNaN(new Date(dataInicial).getTime())) {
      // Se não for válida, usa a data atual
      dataInicial = new Date().toISOString().split('T')[0];
    }
  
    const base = new Date(dataInicial);
    
    // Verifica novamente se a base é válida
    if (isNaN(base.getTime())) {
      base = new Date();
    }
  
    for (let i = 0; i < n; i++) {
      const novaData = new Date(base);
      novaData.setMonth(novaData.getMonth() + i);
      
      // Verifica se a nova data é válida
      if (!isNaN(novaData.getTime())) {
        datas.push(novaData.toISOString().split('T')[0]);
      } else {
        // Se não for válida, adiciona uma data padrão
        const dataPadrao = new Date();
        dataPadrao.setMonth(dataPadrao.getMonth() + i);
        datas.push(dataPadrao.toISOString().split('T')[0]);
      }
    }
    return datas;
  };

  const criarContasReceber = async () => {
    const total = parseFloat(calcularTotal());
    const n = parseInt(parcelas) || 1;
    const valorParcela = total / n;
    const datas = calcularVencimentos(n, vencimento);

    for (let i = 0; i < n; i++) {
      await api.post('/financeiro/contas-receber', {
        pedido_id: pedido.id,
        cliente_id: parseInt(clienteId),
        valor: valorParcela.toFixed(2),
        data_vencimento: datas[i],
        forma_pagamento: formaPagamento,
        descricao: `Parcela ${i + 1}/${n} - Pedido #${pedido.id}`
      });
    }
  };

  const handleSalvar = async () => {
    try {
      const payload = {
        cliente_id: parseInt(clienteId),
        status,
        produtos: produtos.map(p => ({
          produto_id: p.produto_id,
          quantidade: p.quantidade
        })),
        atualizacao_completa: true
      };

      await api.put(`/pedidos/${pedido.id}`, payload);

      if (status === 'Concluído' && gerarContas) {
        await criarContasReceber();
        alert('Pedido e contas a receber atualizados com sucesso!');
      } else {
        alert('Pedido atualizado com sucesso!');
      }

      onRefresh();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar pedido.');
    }
  };

  if (!visible || !pedido) return null;

  return (
    <Modal visible={visible} animationType="slide">
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Editar Pedido #{pedido.id}</Text>

        <Text style={styles.label}>Cliente</Text>
        <Picker
          selectedValue={clienteId}
          onValueChange={value => setClienteId(value)}
        >
          {clientes?.map(c => (
            <Picker.Item key={c.id} label={c.nome} value={c.id.toString()} />
          ))}
        </Picker>

        <Text style={styles.label}>Status</Text>
        <Picker
          selectedValue={status}
          onValueChange={value => setStatus(value)}
        >
          <Picker.Item label="Pendente" value="Pendente" />
          <Picker.Item label="Processando" value="Processando" />
          <Picker.Item label="Concluído" value="Concluído" />
          <Picker.Item label="Cancelado" value="Cancelado" />
        </Picker>

        <Text style={styles.label}>Adicionar Produto</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome do produto"
          value={buscaProduto}
          onChangeText={setBuscaProduto}
          onBlur={buscarProdutos}
        />
        <TextInput
          style={styles.input}
          placeholder="Quantidade"
          keyboardType="numeric"
          value={quantidadeAdicionar}
          onChangeText={setQuantidadeAdicionar}
        />

        {produtosEncontrados.map(produto => (
          <Button
            key={produto.id}
            title={`Adicionar ${produto.nome}`}
            onPress={() => adicionarProduto(produto)}
          />
        ))}

        <Text style={styles.label}>Produtos</Text>
        {produtos.map((p, index) => (
          <View key={p.produto_id} style={styles.produtoItem}>
            <Text>{p.nome} (R$ {Number(p.preco || 0).toFixed(2)})</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={p.quantidade.toString()}
              onChangeText={v => handleChangeQuantidade(index, v)}
            />
          </View>
        ))}

        <Text style={styles.total}>Total: R$ {calcularTotal()}</Text>

        {status === 'Concluído' && (
          <View style={styles.extraBox}>
            <Text style={styles.label}>Gerar contas a receber</Text>
            <Button
              title={gerarContas ? '✓ Gerar' : 'Gerar contas'}
              onPress={() => setGerarContas(!gerarContas)}
              color={gerarContas ? 'green' : 'gray'}
            />

            {gerarContas && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Número de parcelas"
                  keyboardType="numeric"
                  value={parcelas}
                  onChangeText={setParcelas}
                />
                <TextInput
                  style={styles.input}
                  placeholder="1º vencimento (YYYY-MM-DD)"
                  value={vencimento}
                  onChangeText={setVencimento}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Forma de pagamento"
                  value={formaPagamento}
                  onChangeText={setFormaPagamento}
                />
              </>
            )}
          </View>
        )}

        <Button title="Salvar Alterações" onPress={handleSalvar} color="green" />
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
  produtoItem: { marginBottom: 10 },
  total: { fontWeight: 'bold', marginVertical: 10 },
  extraBox: { marginTop: 20, backgroundColor: '#eee', padding: 10, borderRadius: 6 }
});

export default EditPedidoModal;