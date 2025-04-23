import React, { useEffect, useState } from 'react';
import api from '../../../api/axiosConfig';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const FluxoCaixa = () => {
  const [fluxo, setFluxo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState([
    dayjs().startOf('month'),
    dayjs().endOf('month')
  ]);

  useEffect(() => {
    fetchFluxoCaixa();
  }, []);

  const fetchFluxoCaixa = async () => {
    try {
      const [startDate, endDate] = dateRange;
      const response = await api.get('/financeiro/fluxo-caixa', {
        params: {
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD')
        }
      });
      setFluxo(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar fluxo de caixa:', error);
      setLoading(false);
    }
  };

  const handleDateChange = (dates) => {
    setDateRange(dates);
    fetchFluxoCaixa();
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="fluxo-caixa-container">
      <div className="fluxo-header">
        <h2>Fluxo de Caixa</h2>
        <RangePicker 
          value={dateRange}
          onChange={handleDateChange}
          style={{ width: 250 }}
        />
      </div>
      
      <table className="fluxo-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Tipo</th>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Categoria</th>
          </tr>
        </thead>
        <tbody>
          {fluxo.map(item => (
            <tr key={item.id} className={`tipo-${item.tipo}`}>
              <td>{new Date(item.data).toLocaleDateString()}</td>
              <td>{item.tipo === 'entrada' ? 'Entrada' : 'Saída'}</td>
              <td>{item.descricao}</td>
              <td>R$ {item.valor.toFixed(2)}</td>
              <td>{item.categoria}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FluxoCaixa;