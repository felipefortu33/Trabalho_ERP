// src/pages/Pedidos/components/PedidoForm.jsx
import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const PedidoForm = ({
  novoPedido,
  setNovoPedido,
  clientes,
  produtoBuscaTermo,
  setProdutoBuscaTermo,
  produtosEncontrados,
  quantidadeProduto,
  setQuantidadeProduto,
  buscarProdutos,
  adicionarProdutoAoPedido,
  removerProdutoDoPedido,
  handleSubmit,
  onClose
}) => {
  return (
    <form onSubmit={handleSubmit}>
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
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default PedidoForm;