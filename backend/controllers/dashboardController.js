import db from '../config/db.js';

export const getDashboardStats = async (req, res) => {
  try {
    // Executar todas as consultas em paralelo
    const [
      [clientes],
      [pedidos],
      [produtos],
      [vendas],
      [pendentes]
    ] = await Promise.all([
      db.execute('SELECT COUNT(*) as total FROM clientes'),
      db.execute('SELECT COUNT(*) as total FROM pedidos WHERE MONTH(data) = MONTH(CURRENT_DATE())'),
      db.execute('SELECT COUNT(*) as total FROM produtos'),
      db.execute(`
        SELECT SUM(pr.preco * pp.quantidade) as total 
        FROM pedido_produtos pp
        JOIN produtos pr ON pp.produto_id = pr.id
        JOIN pedidos p ON pp.pedido_id = p.id
        WHERE p.status = 'Concluído' AND MONTH(p.data) = MONTH(CURRENT_DATE())
      `),
      db.execute('SELECT COUNT(*) as total FROM pedidos WHERE status = "Pendente"')
    ]);

    res.json({
      totalClientes: clientes[0].total,
      totalPedidos: pedidos[0].total,
      totalProdutos: produtos[0].total,
      vendasMes: vendas[0].total || 0,
      pedidosPendentes: pendentes[0].total
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas do dashboard:', error);
    res.status(500).json({ error: 'Erro ao carregar dados do dashboard' });
  }
};