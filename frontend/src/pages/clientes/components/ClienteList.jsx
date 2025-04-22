import React from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const ClienteList = ({ clientes, onEdit, onDelete }) => {
  return (
    <div className="clientes-table-container">
      {clientes.length === 0 ? (
        <p className="no-clientes">Nenhum cliente cadastrado.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Contato</th>
              <th>Email</th>
              <th>Endereço</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nome}</td>
                <td>{cliente.contato}</td>
                <td>{cliente.email}</td>
                <td>{cliente.endereco}</td>
                <td className="actions-buttons">
                  <button
                    className="btn-icon editar"
                    onClick={() => onEdit(cliente)}
                  >
                    <FiEdit />
                  </button>
                  <button
                    className="btn-icon excluir"
                    onClick={() => onDelete(cliente)}
                  >
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

export default ClienteList;