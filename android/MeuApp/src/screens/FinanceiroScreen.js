import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import ResumoFinanceiro from '../components/financeiro/ResumoFinanceiro';
import ContasReceber from '../components/financeiro/ContasReceber';
import ContasPagar from '../components/financeiro/ContasPagar';
import FluxoCaixa from '../components/financeiro/FluxoCaixa';
import TabsFinanceiro from '../components/financeiro/TabsFinanceiro';
import AnimatedContainer from '../components/common/AnimatedContainer';
import { colors, spacing } from '../utils/colors';

const FinanceiroScreen = () => {
  const [activeTab, setActiveTab] = useState('resumo');

  const renderContent = () => {
    const content = (() => {
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
    })();

    return (
      <AnimatedContainer delay={200} key={activeTab} style={styles.contentContainer}>
        {content}
      </AnimatedContainer>
    );
  };

  return (
    <View style={styles.container}>
      <AnimatedContainer delay={100}>
        <TabsFinanceiro activeTab={activeTab} setActiveTab={setActiveTab} />
      </AnimatedContainer>
      <View style={styles.content}>
        {renderContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: spacing.lg,
  },
});

export default FinanceiroScreen;
