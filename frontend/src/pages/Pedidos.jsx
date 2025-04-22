// src/pages/Pedidos.jsx
import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiX, FiShoppingCart } from 'react-icons/fi';
import api from '../api/axiosConfig';
import './Pedidos.css';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para o modal de novo pedido
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novoPedido, setNovoPedido] = useState({
    cliente_id: '',
    produtos: [],
    status: 'Pendente'
  });

  // Estados para busca de produtos
  const [produtoBuscaTermo, setProdutoBuscaTermo] = useState('');
  const [produtosEncontrados, setProdutosEncontrados] = useState([]);
  const [quantidadeProduto, setQuantidadeProduto] = useState(1);

  // Estados para edição
  const [pedidoEditando, setPedidoEditando] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchDados();
  }, []);

  const fetchDados = async () => {
    setIsLoading(true);
    try {
      const [pedidosRes, clientesRes, produtosRes] = await Promise.all([
        api.get('/pedidos'),
        api.get('/clientes'),
        api.get('/produtos')
      ]);
      setPedidos(pedidosRes.data);
      setClientes(clientesRes.data);
      setProdutos(produtosRes.data);
      setError(null);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setError('Erro ao carregar dados. Tente recarregar a página.');
    } finally {
      setIsLoading(false);
    }
  };

  const buscarProdutos = () => {
    if (!produtoBuscaTermo.trim()) {
      setProdutosEncontrados([]);
      return;
    }
    const encontrados = produtos.filter(p =>
      p.nome.toLowerCase().includes(produtoBuscaTermo.toLowerCase())
    );
    setProdutosEncontrados(encontrados);
  };

  const adicionarProdutoAoPedido = (produto) => {
    const produtoExistente = novoPedido.produtos.find(p => p.produto_id === produto.id);
    
    if (produtoExistente) {
      // Se o produto já existe, apenas atualiza a quantidade
      setNovoPedido(prev => ({
        ...prev,
        produtos: prev.produtos.map(p =>
          p.produto_id === produto.id
            ? { ...p, quantidade: p.quantidade + quantidadeProduto }
            : p
        )
      }));
    } else {
      // Adiciona novo produto ao pedido
      setNovoPedido(prev => ({
        ...prev,
        produtos: [
          ...prev.produtos,
          {
            produto_id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            quantidade: quantidadeProduto
          }
        ]
      }));
    }
    
    // Resetar busca e quantidade
    setProdutoBuscaTermo('');
    setProdutosEncontrados([]);
    setQuantidadeProduto(1);
  };

  const removerProdutoDoPedido = (produtoId) => {
    setNovoPedido(prev => ({
      ...prev,
      produtos: prev.produtos.filter(p => p.produto_id !== produtoId)
    }));
  };

  const handleAddPedido = async (e) => {
    e.preventDefault();
    try {
      if (novoPedido.produtos.length === 0) {
        alert('Adicione pelo menos um produto ao pedido');
        return;
      }

      await api.post('/pedidos/multiplos', {
        cliente_id: novoPedido.cliente_id,
        produtos: novoPedido.produtos.map(p => ({
          produto_id: p.produto_id,
          quantidade: p.quantidade
        }))
      });

      setIsModalOpen(false);
      setNovoPedido({
        cliente_id: '',
        produtos: [],
        status: 'Pendente'
      });
      fetchDados();
    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao adicionar pedido');
      console.error(error);
    }
  };

  const handleDeletePedido = async (id) => {
    try {
      const confirmMessage = 'Tem certeza que deseja deletar este pedido? ' +
        'Os produtos serão devolvidos ao estoque se o pedido estiver pendente ou cancelado.';
      
      if (!window.confirm(confirmMessage)) {
        return;
      }
  
      const token = localStorage.getItem('token');
      const response = await api.delete(`/pedidos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.message) {
        let feedbackMessage = 'Pedido excluído com sucesso!';
        
        if (response.data.estoque_restaurado) {
          feedbackMessage += `\nProdutos devolvidos ao estoque (Status anterior: ${response.data.status_original})`;
        } else {
          feedbackMessage += `\nO estoque não foi alterado (Status anterior: ${response.data.status_original})`;
        }
        
        alert(feedbackMessage);
        fetchDados(); // Atualizar a lista
      }
    } catch (error) {
      console.error('Erro detalhado:', error.response?.data || error.message);
      alert(`Erro ao excluir pedido: ${error.response?.data?.error || error.message}`);
    }
  };
  

  const handleEditPedido = async (pedido) => {
    try {
      // Buscar detalhes completos do pedido
      const response = await api.get(`/pedidos/${pedido.id}`);
      setPedidoEditando(response.data);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Erro ao buscar detalhes do pedido:', error);
    }
    
  };

  const handleUpdatePedido = async (e) => {
    e.preventDefault();
    
    // Verificar se há produtos no pedido
    if (!pedidoEditando.produtos || pedidoEditando.produtos.length === 0) {
      alert('O pedido deve ter pelo menos um produto');
      return;
    }
  
    try {
      // Preparar os dados para atualização
      const dadosAtualizacao = {
        cliente_id: pedidoEditando.cliente.id,
        status: pedidoEditando.status,
        // Para compatibilidade com a API antiga, enviamos o primeiro produto
        produto_id: pedidoEditando.produtos[0].produto_id,
        quantidade: pedidoEditando.produtos[0].quantidade,
        // Novo campo para indicar que estamos usando a nova estrutura
        atualizacao_completa: true
      };
  
      // Enviar a requisição de atualização
      const response = await api.put(`/pedidos/${pedidoEditando.id}`, dadosAtualizacao);
      
      // Feedback ao usuário
      if (response.data.message) {
        let mensagem = 'Pedido atualizado com sucesso!';
        
        // Adicionar informação sobre estoque se relevante
        if (response.data.estoque_atualizado) {
          mensagem += `\nEstoque atualizado (Status: ${pedidoEditando.status})`;
        }
        
        alert(mensagem);
      }
  
      // Fechar o modal e atualizar os dados
      setIsEditModalOpen(false);
      fetchDados();
      
    } catch (error) {
      console.error('Erro detalhado na atualização:', {
        error: error.response?.data || error.message,
        pedido: pedidoEditando
      });
      
      const mensagemErro = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Erro ao atualizar pedido';
      
      alert(`Erro: ${mensagemErro}`);
    }
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calcularTotalPedido = (pedido) => {
    return pedido.produtos.reduce((total, produto) => {
      return total + (produto.preco * produto.quantidade);
    }, 0).toFixed(2);
  };

  const pedidosFiltrados = pedidos.filter(pedido =>
    pedido.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pedido.produtos.some(produto =>
      produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  

  if (isLoading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="pedidos-container">
      <h1>
        <FiShoppingCart /> Gestão de Pedidos
      </h1>
      
      <div className="pedidos-actions">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Pesquisar por cliente ou produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <FiPlus /> Novo Pedido
        </button>
      </div>

      <div className="pedidos-table-container">
        {pedidosFiltrados.length === 0 ? (
          <p>Nenhum pedido encontrado.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Produtos</th>
                <th>Total</th>
                <th>Data</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.map((pedido) => (
                <tr key={pedido.id}>
                  <td>#{pedido.id}</td>
                  <td>{pedido.cliente.nome}</td>
                  <td>
                    <ul className="produtos-list">
                      {pedido.produtos.map((produto, idx) => (
                        <li key={idx}>
                          {produto.quantidade}x {produto.nome} (R$ {produto.preco})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>R$ {calcularTotalPedido(pedido)}</td>
                  <td>{formatarData(pedido.data)}</td>
                  <td>
                    <span className={`status-badge ${pedido.status.toLowerCase()}`}>
                      {pedido.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-edit" 
                        onClick={() => handleEditPedido(pedido)}
                        title="Editar"
                      >
                        <FiEdit />
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeletePedido(pedido.id)}
                        title="Excluir"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal para Novo Pedido */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Novo Pedido</h2>
              <button className="close-btn" onClick={() => {
                setIsModalOpen(false);
                setNovoPedido({
                  cliente_id: '',
                  produtos: [],
                  status: 'Pendente'
                });
                setProdutoBuscaTermo('');
                setProdutosEncontrados([]);
              }}>
                <FiX />
              </button>
            </div>
            
            <form onSubmit={handleAddPedido}>
              <div className="form-group">
                <label>Cliente</label>
                <select
                  value={novoPedido.cliente_id}
                  onChange={(e) => setNovoPedido({ ...novoPedido, cliente_id: e.target.value })}
                  required
                >
                  <option value="">Selecione um cliente</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Adicionar Produtos</label>
                <div className="produto-search">
                  <input
                    type="text"
                    placeholder="Buscar produto pelo nome..."
                    value={produtoBuscaTermo}
                    onChange={(e) => setProdutoBuscaTermo(e.target.value)}
                  />
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={buscarProdutos}
                  >
                    <FiSearch /> Buscar
                  </button>
                </div>

                {produtoBuscaTermo && (
                  <div className="quantidade-input">
                    <label>Quantidade:</label>
                    <input
                      type="number"
                      min="1"
                      value={quantidadeProduto}
                      onChange={(e) => setQuantidadeProduto(parseInt(e.target.value) || 1)}
                    />
                  </div>
                )}

                {/* Resultados da busca */}
                {produtosEncontrados.length > 0 && (
                  <div className="produtos-encontrados">
                    {produtosEncontrados.map((produto) => (
                      <div key={produto.id} className="produto-item">
                        <div className="produto-info">
                          <span className="produto-nome">{produto.nome}</span>
                          <span className="produto-preco">R$ {produto.preco}</span>
                          <span className="produto-estoque">Estoque: {produto.estoque}</span>
                        </div>
                        <button
                          type="button"
                          className="btn-add"
                          onClick={() => adicionarProdutoAoPedido(produto)}
                        >
                          Adicionar
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Produtos selecionados */}
              <div className="form-group">
                <label>Produtos no Pedido</label>
                {novoPedido.produtos.length === 0 ? (
                  <p className="no-products">Nenhum produto adicionado</p>
                ) : (
                  <ul className="produtos-selecionados">
                    {novoPedido.produtos.map((produto, index) => (
                      <li key={index}>
                        <div className="produto-selecionado-info">
                          <span>{produto.quantidade}x {produto.nome}</span>
                          <span>R$ {(produto.preco * produto.quantidade).toFixed(2)}</span>
                        </div>
                        <button
                          type="button"
                          className="btn-remove"
                          onClick={() => removerProdutoDoPedido(produto.produto_id)}
                        >
                          <FiX />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={novoPedido.status}
                  onChange={(e) => setNovoPedido({ ...novoPedido, status: e.target.value })}
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Processando">Processando</option>
                  <option value="Concluído">Concluído</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>

              <div className="form-total">
                <strong>Total:</strong> R$ {novoPedido.produtos.reduce((total, produto) => {
                  return total + (produto.preco * produto.quantidade);
                }, 0).toFixed(2)}
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  Confirmar Pedido
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setIsModalOpen(false);
                    setNovoPedido({
                      cliente_id: '',
                      produtos: [],
                      status: 'Pendente'
                    });
                    setProdutoBuscaTermo('');
                    setProdutosEncontrados([]);
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Edição de Pedido */}
      {isEditModalOpen && pedidoEditando && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Editar Pedido #{pedidoEditando.id}</h2>
              <button className="close-btn" onClick={() => setIsEditModalOpen(false)}>
                <FiX />
              </button>
            </div>
            
            <form onSubmit={handleUpdatePedido}>
              <div className="form-group">
                <label>Cliente</label>
                <select
                  value={pedidoEditando.cliente.id}
                  onChange={(e) => setPedidoEditando({
                    ...pedidoEditando,
                    cliente: {
                      ...pedidoEditando.cliente,
                      id: e.target.value
                    }
                  })}
                  required
                >
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Produtos</label>
                <ul className="produtos-selecionados">
                  {pedidoEditando.produtos.map((produto, index) => (
                    <li key={index}>
                      <div className="produto-selecionado-info">
                        <span>{produto.quantidade}x {produto.nome}</span>
                        <span>R$ {(produto.preco * produto.quantidade).toFixed(2)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={pedidoEditando.status}
                  onChange={(e) => setPedidoEditando({ ...pedidoEditando, status: e.target.value })}
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Processando">Processando</option>
                  <option value="Concluído">Concluído</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>

              <div className="form-total">
                <strong>Total:</strong> R$ {calcularTotalPedido(pedidoEditando)}
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  Salvar Alterações
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pedidos;