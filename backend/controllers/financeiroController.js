import db from '../config/db.js';

// Contas a Receber
export const getContasReceber = async (req, res) => {
  try {
    const [contas] = await db.execute(`
      SELECT cr.*, c.nome as cliente_nome, p.id as pedido_id
      FROM contas_receber cr
      LEFT JOIN clientes c ON cr.cliente_id = c.id
      LEFT JOIN pedidos p ON cr.pedido_id = p.id
      ORDER BY cr.data_vencimento
    `);
    res.json(contas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar contas a receber' });
  }
};

export const createContaReceber = async (req, res) => {
  const { pedido_id, cliente_id, valor, data_vencimento, forma_pagamento } = req.body;
  
  try {
    await db.execute(
      'INSERT INTO contas_receber (pedido_id, cliente_id, valor, data_vencimento, forma_pagamento) VALUES (?, ?, ?, ?, ?)',
      [pedido_id, cliente_id, valor, data_vencimento, forma_pagamento]
    );
    
    // Atualizar fluxo de caixa
    await db.execute(
      'INSERT INTO fluxo_caixa (tipo, valor, data, descricao, categoria, referencia_id, referencia_tipo) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['entrada', valor, data_vencimento, 'Conta a receber criada', 'recebimento', null, 'conta_receber']
    );
    
    res.status(201).json({ message: 'Conta a receber criada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar conta a receber' });
  }
};

export const registrarPagamentoReceber = async (req, res) => {
  const { id } = req.params;
  const { data_pagamento, forma_pagamento } = req.body;
  
  try {
    await db.execute(
      'UPDATE contas_receber SET status = "pago", data_pagamento = ?, forma_pagamento = ? WHERE id = ?',
      [data_pagamento, forma_pagamento, id]
    );
    
    // Registrar no fluxo de caixa
    const [conta] = await db.execute('SELECT valor FROM contas_receber WHERE id = ?', [id]);
    await db.execute(
      'INSERT INTO fluxo_caixa (tipo, valor, data, descricao, categoria, referencia_id, referencia_tipo) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['entrada', conta[0].valor, data_pagamento, 'Recebimento de conta', 'recebimento', id, 'conta_receber']
    );
    
    res.json({ message: 'Pagamento registrado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar pagamento' });
  }
};

// Contas a Pagar
export const getContasPagar = async (req, res) => {
  try {
    const [contas] = await db.execute('SELECT * FROM contas_pagar ORDER BY data_vencimento');
    res.json(contas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar contas a pagar' });
  }
};

export const createContaPagar = async (req, res) => {
  const { descricao, valor, data_vencimento, fornecedor, categoria } = req.body;
  
  try {
    await db.execute(
      'INSERT INTO contas_pagar (descricao, valor, data_vencimento, fornecedor, categoria) VALUES (?, ?, ?, ?, ?)',
      [descricao, valor, data_vencimento, fornecedor, categoria]
    );
    
    res.status(201).json({ message: 'Conta a pagar criada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar conta a pagar' });
  }
};

export const registrarPagamentoPagar = async (req, res) => {
  const { id } = req.params;
  const { data_pagamento, forma_pagamento } = req.body;
  
  try {
    await db.execute(
      'UPDATE contas_pagar SET status = "pago", data_pagamento = ?, forma_pagamento = ? WHERE id = ?',
      [data_pagamento, forma_pagamento, id]
    );
    
    // Registrar no fluxo de caixa
    const [conta] = await db.execute('SELECT valor FROM contas_pagar WHERE id = ?', [id]);
    await db.execute(
      'INSERT INTO fluxo_caixa (tipo, valor, data, descricao, categoria, referencia_id, referencia_tipo) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['saida', conta[0].valor, data_pagamento, 'Pagamento de conta', 'pagamento', id, 'conta_pagar']
    );
    
    res.json({ message: 'Pagamento registrado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar pagamento' });
  }
};

// Fluxo de Caixa
export const getFluxoCaixa = async (req, res) => {
  const { startDate, endDate } = req.query;
  
  try {
    let query = 'SELECT * FROM fluxo_caixa';
    const params = [];
    
    if (startDate && endDate) {
      query += ' WHERE data BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }
    
    query += ' ORDER BY data DESC';
    
    const [fluxo] = await db.execute(query, params);
    res.json(fluxo);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar fluxo de caixa' });
  }
};

// Relatórios Financeiros
export const getResumoFinanceiro = async (req, res) => {
    try {
      const resultados = await Promise.all([
        db.execute('SELECT SUM(valor) as total FROM contas_receber WHERE status = "pago" AND MONTH(data_pagamento) = MONTH(CURRENT_DATE())'),
        db.execute('SELECT SUM(valor) as total FROM contas_pagar WHERE status = "pago" AND MONTH(data_pagamento) = MONTH(CURRENT_DATE())'),
        db.execute('SELECT SUM(valor) as total FROM contas_receber WHERE status = "pendente"'),
        db.execute('SELECT SUM(valor) as total FROM contas_pagar WHERE status = "pendente"')
      ]);
      
      res.json({
        recebimentosMes: resultados[0][0][0].total || 0,
        pagamentosMes: resultados[1][0][0].total || 0,
        contasReceberPendentes: resultados[2][0][0].total || 0,
        contasPagarPendentes: resultados[3][0][0].total || 0
      });
    } catch (error) {
      console.error('Erro detalhado:', error);
      res.status(500).json({ error: 'Erro ao gerar resumo financeiro', details: error.message });
    }
  };