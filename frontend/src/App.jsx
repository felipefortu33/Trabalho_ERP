import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Clientes from './pages/Clientes';
import Produtos from './pages/Produtos';
import Pedidos from './pages/Pedidos';
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Bem-vindo ao ERP</h1>} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
