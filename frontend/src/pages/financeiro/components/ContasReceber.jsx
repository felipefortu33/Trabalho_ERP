import React, { useEffect, useState } from 'react';
import api from '../../../api/axiosConfig';
import AddContaReceberModal from './AddContaReceberModal';
import PagarContaModal from './PagarContaModal';

const ContasReceber = () => {
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [contaToPay, setContaToPay] = useState(null);

  useEffect(() => {
    fetchContasReceber();
  }, []);

  const fetchContasReceber = async () => {
    try {
      const response = await api.get('/financeiro/contas-receber');
      setContas(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar contas a receber:', error);
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
        <h2>Contas a Receber</h2>
        <button onClick={() => setIsAddModalOpen(true)}>Adicionar Conta</button>
      </div>
      
      <table className="contas-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Pedido</th>
            <th>Valor</th>
            <th>Vencimento</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {contas.map(conta => (
            <tr key={conta.id} className={`status-${conta.status}`}>
              <td>{conta.cliente_nome || 'N/A'}</td>
              <td>{conta.pedido_id ? `#${conta.pedido_id}` : 'N/A'}</td>
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
      
      <AddContaReceberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchContasReceber}
      />
      
      {contaToPay && (
        <PagarContaModal
          isOpen={!!contaToPay}
          onClose={() => setContaToPay(null)}
          conta={contaToPay}
          tipo="receber"
          onSuccess={fetchContasReceber}
        />
      )}
    </div>
  );
};

export default ContasReceber;