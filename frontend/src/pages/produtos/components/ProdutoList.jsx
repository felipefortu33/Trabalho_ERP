import React from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('data:') || url.startsWith('http')) return url;
  return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${url}`;
};

const ProdutoList = ({ produtos, handleEdit, handleDelete }) => {
  return (
    <div className="produtos-table-container">
      {produtos.length === 0 ? (
        <p>Nenhum produto cadastrado.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Imagem</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.nome}</td>
                <td>{produto.descricao}</td>
                <td>{produto.categoria}</td>
                <td>{produto.preco}</td>
                <td>{produto.estoque}</td>
                <td>
                  {produto.url && (
                    <img src={getImageUrl(produto.url)} alt={produto.nome} width="250" />
                  )}
                </td>
                <td>
                  <button onClick={() => handleEdit(produto)}>
                    <FiEdit />
                  </button>
                  <button onClick={() => handleDelete(produto)}>
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProdutoList;