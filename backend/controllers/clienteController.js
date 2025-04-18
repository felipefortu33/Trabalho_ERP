import db from '../config/db.js';

export const getClientes = async (req, res) => {
  const [clientes] = await db.execute('SELECT * FROM clientes');
  res.json(clientes);
};

export const addCliente = async (req, res) => {
  const { nome, contato, email, endereco } = req.body;
  try {
    await db.execute(
      'INSERT INTO clientes (nome, contato, email, endereco) VALUES (?, ?, ?, ?)',
      [nome, contato, email, endereco]
    );
    res.status(201).json({ message: 'Cliente cadastrado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar cliente' });
  }
  
};

export const editCliente = async (req, res) => {
  const { id } = req.params;
  const { nome, contato, email, endereco } = req.body;

  try {
    const [result] = await db.execute(
      'UPDATE clientes SET nome = ?, contato = ?, email = ?, endereco = ? WHERE id = ?',
      [nome, contato, email, endereco, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    res.json({ message: 'Cliente atualizado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
};

export const deleteCliente = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute('DELETE FROM clientes WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    res.json({ message: 'Cliente excluído com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir cliente' });
  }
};

export const searchClientes = async (req, res) => {
  const { nome } = req.query;

  try {
    const [clientes] = await db.execute(
      'SELECT * FROM clientes WHERE nome LIKE ?',
      [`%${nome}%`]  // Usando o operador LIKE para buscar por nomes que contenham o texto passado
    );

    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao pesquisar clientes' });
  }
};
