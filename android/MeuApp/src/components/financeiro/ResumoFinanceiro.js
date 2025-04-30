import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import api from '../../api/axiosConfig';
import CardResumo from './CardResumo';

const ResumoFinanceiro = () => {
  const [resumo, setResumo] = useState({
    recebimentosMes: 0,
    pagamentosMes: 0,
    contasReceberPendentes: 0,
    contasPagarPendentes: 0,
  });

  useEffect(() => {
    const fetchResumo = async () => {
      try {
        const response = await api.get('/financeiro/resumo-financeiro');
        setResumo(response.data);
      } catch (error) {
        console.error('Erro ao buscar resumo financeiro:', error);
      }
    };

    fetchResumo();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Resumo Financeiro</Text>
      
      <View style={styles.grid}>
        <CardResumo 
          titulo="Recebimentos" 
          valor={resumo.recebimentosMes} 
          cor="#4CAF50" 
          icone="💰"
        />
        <CardResumo 
          titulo="Pagamentos" 
          valor={resumo.pagamentosMes} 
          cor="#F44336" 
          icone="💸"
        />
        <CardResumo 
          titulo="A Receber" 
          valor={resumo.contasReceberPendentes} 
          cor="#2196F3" 
          icone="⏳"
        />
        <CardResumo 
          titulo="A Pagar" 
          valor={resumo.contasPagarPendentes} 
          cor="#FF9800" 
          icone="⌛"
        />
      </View>
    </ScrollView>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default ResumoFinanceiro;