import db from '../config/db.js';

export const getProdutos = async (req, res) => {
  const [produtos] = await db.execute('SELECT * FROM produtos');
  res.json(produtos);
};

export const addProduto = async (req, res) => {
  const { nome, preco, estoque } = req.body;
  try {
    await db.execute('INSERT INTO produtos (nome, preco, estoque) VALUES (?, ?, ?)', [nome, preco, estoque]);
    res.status(201).json({ message: 'Produto adicionado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar produto' });
  }
};
