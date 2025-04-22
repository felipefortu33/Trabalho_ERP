import React from 'react';

const ProdutoForm = ({ produto, setProduto, imagem, setImagem, onSubmit, onCancel }) => {
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Nome"
        value={produto.nome}
        onChange={(e) => setProduto({ ...produto, nome: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Descrição"
        value={produto.descricao}
        onChange={(e) => setProduto({ ...produto, descricao: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Categoria"
        value={produto.categoria}
        onChange={(e) => setProduto({ ...produto, categoria: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Preço"
        value={produto.preco}
        onChange={(e) => setProduto({ ...produto, preco: e.target.value })}
        required
        min="0"
        step="0.01"
      />
      <input
        type="number"
        placeholder="Estoque"
        value={produto.estoque}
        onChange={(e) => setProduto({ ...produto, estoque: e.target.value })}
        required
        min="0"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImagem(e.target.files[0])}
      />
      <div className="form-actions">
        <button type="submit">Salvar</button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
};

export default ProdutoForm;