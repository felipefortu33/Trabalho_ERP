import React from 'react';
import { FiDollarSign, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';


const ResumoFinanceiro = ({ data }) => {
    if (!data) return <div>Resumo indisponível</div>;

    return (
    
    <div className="resumo-financeiro">
      <div className="resumo-grid">
        <div className="resumo-card">
          <FiTrendingUp className="icon receita" />
          <h3>Receitas do Mês</h3>
          <p>R$ {data.recebimentosMes.toFixed(2)}</p>
        </div>
        
        <div className="resumo-card">
          <FiTrendingDown className="icon despesa" />
          <h3>Despesas do Mês</h3>
          <p>R$ {data.pagamentosMes.toFixed(2)}</p>
        </div>
        
        <div className="resumo-card">
          <FiDollarSign className="icon receber" />
          <h3>A Receber</h3>
          <p>R$ {data.contasReceberPendentes.toFixed(2)}</p>
        </div>
        
        <div className="resumo-card">
          <FiDollarSign className="icon pagar" />
          <h3>A Pagar</h3>
          <p>R$ {data.contasPagarPendentes.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default ResumoFinanceiro;