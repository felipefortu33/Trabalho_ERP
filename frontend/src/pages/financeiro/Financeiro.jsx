import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import './Financeiro.css';
import ResumoFinanceiro from './components/ResumoFinanceiro';
import ContasReceber from './components/ContasReceber';
import ContasPagar from './components/ContasPagar';
import FluxoCaixa from './components/FluxoCaixa';

const Financeiro = () => {
  const [activeTab, setActiveTab] = useState('resumo');
  const [resumo, setResumo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    fetchResumoFinanceiro();
  }, [navigate]);

  const fetchResumoFinanceiro = async () => {
    try {
      const response = await api.get('/financeiro/resumo-financeiro');
      setResumo(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar resumo financeiro:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="financeiro-container">
      <h1>Gestão Financeira</h1>
      
      <div className="financeiro-tabs">
        <button 
          className={activeTab === 'resumo' ? 'active' : ''}
          onClick={() => setActiveTab('resumo')}
        >
          Resumo
        </button>
        <button 
          className={activeTab === 'receber' ? 'active' : ''}
          onClick={() => setActiveTab('receber')}
        >
          Contas a Receber
        </button>
        <button 
          className={activeTab === 'pagar' ? 'active' : ''}
          onClick={() => setActiveTab('pagar')}
        >
          Contas a Pagar
        </button>
        <button 
          className={activeTab === 'fluxo' ? 'active' : ''}
          onClick={() => setActiveTab('fluxo')}
        >
          Fluxo de Caixa
        </button>
      </div>
      
      <div className="financeiro-content">
        {activeTab === 'resumo' && <ResumoFinanceiro data={resumo} />}
        {activeTab === 'receber' && <ContasReceber />}
        {activeTab === 'pagar' && <ContasPagar />}
        {activeTab === 'fluxo' && <FluxoCaixa />}
      </div>
    </div>
  );
};

export default Financeiro;