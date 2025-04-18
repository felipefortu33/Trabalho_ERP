// components/Sidebar.jsx
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/clientes">👥 Clientes</Link>
        </li>
        <li>
          <Link to="/produtos">📦 Produtos</Link>
        </li>
        <li>
          <Link to="/pedidos">🧾 Pedidos</Link>
        </li>
        <li onClick={handleLogout} className="logout">
          🚪 Sair
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
