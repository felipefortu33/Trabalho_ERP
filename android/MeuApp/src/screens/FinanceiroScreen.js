import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import ResumoFinanceiro from '../components/financeiro/ResumoFinanceiro';
import ContasReceber from '../components/financeiro/ContasReceber';
import ContasPagar from '../components/financeiro/ContasPagar';
import FluxoCaixa from '../components/financeiro/FluxoCaixa';
import TabsFinanceiro from '../components/financeiro/TabsFinanceiro';

const FinanceiroScreen = () => {
  const [activeTab, setActiveTab] = useState('resumo');

  const renderContent = () => {
    switch (activeTab) {
      case 'receber':
        return <ContasReceber />;
      case 'pagar':
        return <ContasPagar />;
      case 'fluxo':
        return <FluxoCaixa />;
      default:
        return <ResumoFinanceiro />;
    }
  };

  return (
    <View style={styles.container}>
      <TabsFinanceiro activeTab={activeTab} setActiveTab={setActiveTab} />
      <View style={styles.content}>
        {renderContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
});

export default FinanceiroScreen;
