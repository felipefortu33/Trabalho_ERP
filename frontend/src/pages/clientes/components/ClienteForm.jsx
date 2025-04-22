import React from 'react';

const ClienteForm = ({ cliente, onChange, onSubmit, onCancel }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label>Nome</label>
        <input
          type="text"
          value={cliente.nome}
          onChange={(e) => onChange({ ...cliente, nome: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Contato</label>
        <input
          type="text"
          value={cliente.contato}
          onChange={(e) => onChange({ ...cliente, contato: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={cliente.email}
          onChange={(e) => onChange({ ...cliente, email: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Endereço</label>
        <input
          type="text"
          value={cliente.endereco}
          onChange={(e) => onChange({ ...cliente, endereco: e.target.value })}
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit">Salvar</button>
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default ClienteForm;