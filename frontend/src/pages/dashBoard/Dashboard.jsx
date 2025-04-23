import React, { useEffect, useState } from 'react';
import { FiUsers, FiShoppingCart, FiPackage, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalPedidos: 0,
    totalProdutos: 0,
    vendasMes: 0,
    pedidosPendentes: 0
  });
  const [recentPedidos, setRecentPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, pedidosRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/pedidos?limit=5')
        ]);
        
        setStats(statsRes.data);
        setRecentPedidos(pedidosRes.data);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err);
        setError('Erro ao carregar dados do dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) return <div className="dashboard-loading">Carregando dashboard...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      
      <div className="stats-grid">
        <StatCard 
          icon={<FiUsers size={24} />}
          title="Total de Clientes"
          value={stats.totalClientes}
          color="#4e73df"
        />
        <StatCard 
          icon={<FiShoppingCart size={24} />}
          title="Pedidos (Mês)"
          value={stats.totalPedidos}
          color="#1cc88a"
        />
        <StatCard 
          icon={<FiPackage size={24} />}
          title="Produtos Cadastrados"
          value={stats.totalProdutos}
          color="#36b9cc"
        />
        <StatCard 
          icon={<FiDollarSign size={24} />}
          title="Vendas (Mês)"
          value={`R$ ${Number(stats.vendasMes || 0).toFixed(2)}`}
          color="#f6c23e"
        />
        <StatCard 
          icon={<FiTrendingUp size={24} />}
          title="Pedidos Pendentes"
          value={stats.pedidosPendentes}
          color="#e74a3b"
        />
      </div>

      <div className="dashboard-content">
        <RecentPedidosTable pedidos={recentPedidos} />
        <QuickActions navigate={navigate} />
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <div className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
    <div className="stat-icon" style={{ color }}>{icon}</div>
    <div className="stat-content">
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
    </div>
  </div>
);

const RecentPedidosTable = ({ pedidos }) => (
  <div className="recent-pedidos">
    <h2>Pedidos Recentes</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Cliente</th>
          <th>Data</th>
          <th>Status</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {pedidos.map(pedido => (
          <tr key={pedido.id}>
            <td>{pedido.id}</td>
            <td>{pedido.cliente.nome}</td>
            <td>{new Date(pedido.data).toLocaleDateString()}</td>
            <td>
              <span className={`status-badge ${pedido.status.toLowerCase()}`}>
                {pedido.status}
              </span>
            </td>
            <td>
              R$ {pedido.produtos.reduce((total, produto) => 
                total + (produto.preco * produto.quantidade), 0).toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const QuickActions = ({ navigate }) => (
  <div className="quick-actions">
    <h2>Ações Rápidas</h2>
    <div className="action-buttons">
      <button onClick={() => navigate('/clientes')}>
        <FiUsers /> Gerenciar Clientes
      </button>
      <button onClick={() => navigate('/pedidos')}>
        <FiShoppingCart /> Gerenciar Pedidos
      </button>
      <button onClick={() => navigate('/produtos')}>
        <FiPackage /> Gerenciar Produtos
      </button>
      <button onClick={() => navigate('/pedidos/new')}>
        <FiShoppingCart /> Novo Pedido
      </button>
    </div>
  </div>
);

export default Dashboard;