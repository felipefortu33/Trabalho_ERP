import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('');

  // Atualiza o item ativo quando a rota muda
  useEffect(() => {
    setActiveItem(location.pathname.split('/')[1] || 'dashboard');
  }, [location]);

  const handleLogout = () => {
    // Limpa autenticação
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    // Redireciona para login e recarrega para limpar o estado da aplicação
    window.location.href = '/login';
  };

  // Itens do menu com estrutura mais organizada
  const menuItems = [
    { path: 'dashboard', icon: '📊', label: 'Dashboard' },
    { path: 'clientes', icon: '👥', label: 'Clientes' },
    { path: 'produtos', icon: '📦', label: 'Produtos' },
    { path: 'pedidos', icon: '🧾', label: 'Pedidos' },
    { path: 'financeiro', icon: '💰', label: 'Financeiro' },
  ];

  return (
    <nav className="sidebar" aria-label="Navegação principal">
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li 
            key={item.path}
            className={`sidebar-item ${activeItem === item.path ? 'active' : ''}`}
          >
            <Link 
              to={`/${item.path}`} 
              className="sidebar-link"
              aria-current={activeItem === item.path ? 'page' : undefined}
            >
              <span className="sidebar-icon" aria-hidden="true">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </Link>
          </li>
        ))}
        
        <li className="sidebar-item logout">
          <button 
            onClick={handleLogout} 
            className="sidebar-link"
            aria-label="Sair do sistema"
          >
            <span className="sidebar-icon" aria-hidden="true">🚪</span>
            <span className="sidebar-label">Sair</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;