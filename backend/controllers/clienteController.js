import db from '../config/db.js';

export const getClientes = async (req, res) => {
  const [clientes] = await db.execute('SELECT * FROM clientes');
  res.json(clientes);
};

export const addCliente = async (req, res) => {
  const { nome, contato } = req.body;
  try {
    await db.execute('INSERT INTO clientes (nome, contato) VALUES (?, ?)', [nome, contato]);
    res.status(201).json({ message: 'Cliente cadastrado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar cliente' });
  }
};
