import React, { useEffect, useState } from 'react';
import api from '../../../api/axiosConfig';
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

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="contas-container">
      <div className="contas-header">
        <h2>Contas a Pagar</h2>
        <button onClick={() => setIsAddModalOpen(true)}>Adicionar Conta</button>
      </div>
      
      <table className="contas-table">
        <thead>
          <tr>
            <th>Fornecedor</th>
            <th>Referência</th>
            <th>Valor</th>
            <th>Vencimento</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {contas.map(conta => (
            <tr key={conta.id} className={`status-${conta.status}`}>
              <td>{conta.fornecedor_nome || 'N/A'}</td>
              <td>{conta.referencia || 'N/A'}</td>
              <td>R$ {conta.valor.toFixed(2)}</td>
              <td>{new Date(conta.data_vencimento).toLocaleDateString()}</td>
              <td>
                <span className={`status-badge ${conta.status}`}>
                  {conta.status === 'pendente' ? 'Pendente' : 
                   conta.status === 'pago' ? 'Pago' : 'Atrasado'}
                </span>
              </td>
              <td>
                {conta.status === 'pendente' && (
                  <button 
                    className="btn-pagar"
                    onClick={() => handlePagarConta(conta)}
                  >
                    Registrar Pagamento
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
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
    </div>
  );
};

export default ContasPagar;
