// App.jsx
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Clientes from './pages/clientes/Clientes.jsx';
import Produtos from './pages/produtos/Produtos.jsx';
import Pedidos from './pages/pedidos/Pedidos.jsx';
import AuthPage from './pages/authPage/AuthPage.jsx'; // Componente unificado
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/dashboard/Dashboard';
import Financeiro from './pages/financeiro/Financeiro.jsx';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';


function App() {
  // Wrapper com layout padrão para rotas privadas
  const AuthenticatedLayout = ({ children }) => (
    <div>
      <Topbar />
      <div className="main-layout">
        <Sidebar />
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/cadastro" element={<AuthPage />} />

        {/* Rotas privadas com layout autenticado */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AuthenticatedLayout>
                <h1>Bem-vindo ao ERP</h1>
              </AuthenticatedLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/financeiro"
          element={
            <PrivateRoute>
              <AuthenticatedLayout>
                <Financeiro />
              </AuthenticatedLayout>
            </PrivateRoute>
          }
          />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <AuthenticatedLayout>
                <Dashboard />
              </AuthenticatedLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/clientes"
          element={
            <PrivateRoute>
              <AuthenticatedLayout>
                <Clientes />
              </AuthenticatedLayout>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/produtos"
          element={
            <PrivateRoute>
              <AuthenticatedLayout>
                <Produtos />
              </AuthenticatedLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/pedidos"
          element={
            <PrivateRoute>
              <AuthenticatedLayout>
                <Pedidos />
              </AuthenticatedLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
