// App.jsx
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Clientes from './pages/Clientes';
import Produtos from './pages/Produtos';
import Pedidos from './pages/Pedidos';
import PrivateRoute from './components/PrivateRoute';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import AuthPage from './pages/AuthPage'; // Componente unificado

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
        <Route path="/login" element={<AuthPage />} />
        {/* Se quiser, pode redirecionar /cadastro para /login */}
        <Route path="/cadastro" element={<AuthPage />} />

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
