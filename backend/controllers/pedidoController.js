import db from '../config/db.js';

export const getPedidos = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const [pedidosData] = await conn.execute(`
      SELECT p.id, p.status, p.data, p.estoque_baixado, c.id AS cliente_id, c.nome AS cliente_nome
      FROM pedidos p
      JOIN clientes c ON p.cliente_id = c.id
      ORDER BY p.data DESC
    `);

    if (pedidosData.length === 0) {
      return res.json([]);
    }

    const pedidoIds = pedidosData.map(p => p.id);

    const [produtosData] = await conn.execute(`
      SELECT pp.pedido_id, pr.id, pr.nome, pr.preco, pp.quantidade
      FROM pedido_produtos pp
      JOIN produtos pr ON pp.produto_id = pr.id
      WHERE pp.pedido_id IN (${pedidoIds.map(() => '?').join(',')})
    `, pedidoIds);

    const produtosPorPedido = {};
    for (const prod of produtosData) {
      if (!produtosPorPedido[prod.pedido_id]) {
        produtosPorPedido[prod.pedido_id] = [];
      }
      produtosPorPedido[prod.pedido_id].push({
        id: prod.id,
        nome: prod.nome,
        preco: prod.preco,
        quantidade: prod.quantidade
      });
    }

    const pedidos = pedidosData.map(pedido => ({
      id: pedido.id,
      status: pedido.status,
      data: pedido.data,
      estoque_baixado: !!pedido.estoque_baixado,
      cliente: {
        id: pedido.cliente_id,
        nome: pedido.cliente_nome
      },
      produtos: produtosPorPedido[pedido.id] || []
    }));

    res.json(pedidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  } finally {
    conn.release();
  }
};


export const addPedido = async (req, res) => {
  const { cliente_id, produto_id, quantidade, status } = req.body;
  const data = new Date();

  const conn = await db.getConnection();
  try {
    const [produto] = await conn.execute('SELECT estoque FROM produtos WHERE id = ?', [produto_id]);
    if (produto[0].estoque < quantidade) {
      return res.status(400).json({ error: 'Estoque insuficiente para o pedido' });
    }

    await conn.execute(
      'INSERT INTO pedidos (cliente_id, produto_id, data, quantidade, status) VALUES (?, ?, ?, ?, ?)', 
      [cliente_id, produto_id, data, quantidade, status || 'Pendente']
    );
    
    await conn.execute('UPDATE produtos SET estoque = estoque - ? WHERE id = ?', [quantidade, produto_id]);

    res.status(201).json({ message: 'Pedido criado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar pedido' });
  } finally {
    conn.release(); // Liberar a conexão
  }
};

export const updatePedido = async (req, res) => {
  const { id } = req.params;
  console.log('Requisição recebida no updatePedido:', req.body);
  const { cliente_id, status, produto_id, quantidade, atualizacao_completa } = req.body;

  const conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    // 1. Verificar se o pedido existe
    const [[pedidoAtual]] = await conn.execute('SELECT * FROM pedidos WHERE id = ?', [id]);
    if (!pedidoAtual) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    // 2. Atualizar informações básicas do pedido
    await conn.execute(
      'UPDATE pedidos SET cliente_id = ?, status = ? WHERE id = ?',
      [cliente_id, status, id]
    );

    // 3. Lógica de atualização de estoque baseada no status
    if (status === 'Concluído' && !pedidoAtual.estoque_baixado) {
      // Se mudou para Concluído e o estoque ainda não foi baixado
      const [produtosPedido] = await conn.execute(
        'SELECT produto_id, quantidade FROM pedido_produtos WHERE pedido_id = ?',
        [id]
      );

      for (const item of produtosPedido) {
        const [produto] = await conn.execute('SELECT estoque FROM produtos WHERE id = ?', [item.produto_id]);

        if (produto[0].estoque < item.quantidade) {
          throw new Error(`Estoque insuficiente para o produto ${item.produto_id}`);
        }

        await conn.execute(
          'UPDATE produtos SET estoque = estoque - ? WHERE id = ?',
          [item.quantidade, item.produto_id]
        );
      }

      // Marcar que o estoque foi baixado
      await conn.execute(
        'UPDATE pedidos SET estoque_baixado = TRUE WHERE id = ?',
        [id]
      );
    } else if (['Cancelado', 'Pendente'].includes(status) && pedidoAtual.estoque_baixado) {
      // Se mudou para Cancelado/Pendente e o estoque estava baixado
      const [produtosPedido] = await conn.execute(
        'SELECT produto_id, quantidade FROM pedido_produtos WHERE pedido_id = ?',
        [id]
      );

      for (const item of produtosPedido) {
        await conn.execute(
          'UPDATE produtos SET estoque = estoque + ? WHERE id = ?',
          [item.quantidade, item.produto_id]
        );
      }

      // Marcar que o estoque foi devolvido
      await conn.execute(
        'UPDATE pedidos SET estoque_baixado = FALSE WHERE id = ?',
        [id]
      );
    }

    await conn.commit();
    res.json({ 
      message: 'Pedido atualizado com sucesso',
      estoque_atualizado: true
    });
  } catch (error) {
    await conn.rollback();
    console.error('Erro ao atualizar pedido:', error);
    res.status(500).json({ 
      error: 'Erro ao atualizar pedido',
      detalhe: error.message 
    });
  } finally {
    conn.release();
  }
};


export const deletePedido = async (req, res) => {
  const { id } = req.params;

  const conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    // 1. Verificar se o pedido existe e obter seu status
    const [[pedido]] = await conn.execute(
      'SELECT id, status FROM pedidos WHERE id = ?', 
      [id]
    );
    
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    // 2. Obter todos os produtos do pedido
    const [produtosPedido] = await conn.execute(
      'SELECT produto_id, quantidade FROM pedido_produtos WHERE pedido_id = ?',
      [id]
    );

    // 3. Deletar os itens do pedido
    await conn.execute('DELETE FROM pedido_produtos WHERE pedido_id = ?', [id]);
    
    // 4. Deletar o pedido principal
    await conn.execute('DELETE FROM pedidos WHERE id = ?', [id]);

    // 5. Restaurar estoque APENAS se o status for Pendente ou Cancelado
    const deveRestaurarEstoque = ['Pendente', 'Cancelado'].includes(pedido.status);

    if (deveRestaurarEstoque && produtosPedido.length > 0) {
      for (const item of produtosPedido) {
        await conn.execute(
          'UPDATE produtos SET estoque = estoque + ? WHERE id = ?',
          [item.quantidade, item.produto_id]
        );
      }
      console.log(`Estoque restaurado para ${produtosPedido.length} produtos do pedido ${id}`);
    }

    await conn.commit();
    res.json({ 
      message: 'Pedido excluído com sucesso',
      estoque_restaurado: deveRestaurarEstoque,
      status_original: pedido.status
    });
  } catch (error) {
    await conn.rollback();
    console.error('Erro ao deletar pedido:', {
      pedidoId: id,
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      error: 'Erro ao deletar pedido',
      detalhe: error.message 
    });
  } finally {
    conn.release();
  }
};

export const addPedidoMultiplo = async (req, res) => {
  const { cliente_id, produtos } = req.body;

  if (!cliente_id || !Array.isArray(produtos) || produtos.length === 0) {
    return res.status(400).json({ error: 'Dados inválidos' });
  }

  const conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    const [pedidoResult] = await conn.query('INSERT INTO pedidos (cliente_id) VALUES (?)', [cliente_id]);
    const pedidoId = pedidoResult.insertId;

    for (const item of produtos) {
      const { produto_id, quantidade } = item;

      const [[produto]] = await conn.query('SELECT estoque FROM produtos WHERE id = ?', [produto_id]);

      if (!produto) {
        throw new Error(`Produto ${produto_id} não encontrado`);
      }

      if (produto.estoque < quantidade) {
        throw new Error(`Estoque insuficiente para o produto ${produto_id}`);
      }

      await conn.query('INSERT INTO pedido_produtos (pedido_id, produto_id, quantidade) VALUES (?, ?, ?)', [pedidoId, produto_id, quantidade]);
      await conn.query('UPDATE produtos SET estoque = estoque - ? WHERE id = ?', [quantidade, produto_id]);
    }

    await conn.commit();
    res.status(201).json({ message: 'Pedido múltiplo criado com sucesso', pedido_id: pedidoId });
  } catch (error) {
    await conn.rollback();
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar pedido múltiplo', detalhe: error.message });
  } finally {
    conn.release(); // Liberar a conexão
  }
};

export const getPedidoById = async (req, res) => {
  const { id } = req.params;

  const conn = await db.getConnection();
  try {
    const [[pedido]] = await conn.execute(`
      SELECT p.id, p.status, p.data, p.estoque_baixado, c.id AS cliente_id, c.nome AS cliente_nome
      FROM pedidos p
      JOIN clientes c ON p.cliente_id = c.id
      WHERE p.id = ?`, [id]);

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    const [produtos] = await conn.execute(`
      SELECT pr.id, pr.nome, pr.preco, pp.quantidade
      FROM pedido_produtos pp
      JOIN produtos pr ON pp.produto_id = pr.id
      WHERE pp.pedido_id = ?`, [id]);

    res.json({
      id: pedido.id,
      status: pedido.status,
      data: pedido.data,
      estoque_baixado: !!pedido.estoque_baixado,
      cliente: { id: pedido.cliente_id, nome: pedido.cliente_nome },
      produtos
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar pedido' });
  } finally {
    conn.release();
  }
};
