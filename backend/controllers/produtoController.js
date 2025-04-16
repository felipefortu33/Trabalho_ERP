import db from '../config/db.js';

export const getProdutos = async (req, res) => {
  const [produtos] = await db.execute('SELECT * FROM produtos');
  res.json(produtos);
};

export const addProduto = async (req, res) => {
  const { nome, descricao, categoria, preco, estoque } = req.body;
  try {
    await db.execute(
      'INSERT INTO produtos (nome, descricao, categoria, preco, estoque) VALUES (?, ?, ?, ?, ?)',
      [nome, descricao, categoria, preco, estoque]
    );
    res.status(201).json({ message: 'Produto adicionado com sucesso!' });
  }catch (error) {
    console.error('Erro ao adicionar produto:', error); // Adiciona isso
    res.status(500).json({ error: error.message });     // Mostra o erro real
  }

};