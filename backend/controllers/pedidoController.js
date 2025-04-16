import db from '../config/db.js';

export const getPedidos = async (req, res) => {
  const [pedidos] = await db.execute(`
    SELECT p.id, c.nome AS cliente_nome, pr.nome AS produto_nome, p.quantidade, p.data, p.status 
    FROM pedidos p 
    JOIN clientes c ON p.cliente_id = c.id 
    JOIN produtos pr ON p.produto_id = pr.id
  `);
  
  res.json(pedidos);
};

export const addPedido = async (req, res) => {
  const { cliente_id, produto_id, quantidade, status } = req.body;
  const data = new Date();

  try {
    const [produto] = await db.execute('SELECT estoque FROM produtos WHERE id = ?', [produto_id]);
    if (produto[0].estoque < quantidade) {
      return res.status(400).json({ error: 'Estoque insuficiente para o pedido' });
    }

    await db.execute(
      'INSERT INTO pedidos (cliente_id, produto_id, data, quantidade, status) VALUES (?, ?, ?, ?, ?)', 
      [cliente_id, produto_id, data, quantidade, status || 'Pendente']
    );
    
    await db.execute('UPDATE produtos SET estoque = estoque - ? WHERE id = ?', [quantidade, produto_id]);

    res.status(201).json({ message: 'Pedido criado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
};