import db from '../config/db.js';

// Função para buscar todos os produtos
export const getProdutos = async (req, res) => {
  try {
    const [produtos] = await db.execute('SELECT * FROM produtos');
    res.json(produtos);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: error.message });
  }
};

export const addProduto = async (req, res) => {
  const { nome, descricao, categoria, preco, estoque } = req.body;
  const imagem = req.file ? req.file.buffer.toString('base64') : null;

  try {
    await db.execute(
      'INSERT INTO produtos (nome, descricao, categoria, preco, estoque, url) VALUES (?, ?, ?, ?, ?, ?)',
      [nome, descricao, categoria, preco, estoque, imagem]
    );
    res.status(201).json({ message: 'Produto adicionado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduto = async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, categoria, preco, estoque } = req.body;
  const imagem = req.file ? req.file.filename : null;

  if (!nome || !descricao || !categoria || preco === undefined || estoque === undefined) {
    return res.status(400).json({ error: "Campos obrigatórios estão faltando" });
  }

  try {
    const query = `
      UPDATE produtos 
      SET nome = ?, descricao = ?, categoria = ?, preco = ?, estoque = ?, imagem = ? 
      WHERE id = ?
    `;

    const [resultado] = await db.execute(query, [
      nome,
      descricao,
      categoria,
      parseFloat(preco), // transforma em número
      parseInt(estoque), // transforma em número
      imagem,
      id
    ]);

    res.status(200).json({ message: "Produto atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
};



// Função para excluir um produto
export const deleteProduto = async (req, res) => {
  const { id } = req.params; // Pegando o ID diretamente da URL
  console.log("Tentando excluir produto com ID:", id); // Logando o ID antes de executar a exclusão

  try {
    // Verifica se o ID é válido
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const [result] = await db.execute('DELETE FROM produtos WHERE id = ?', [id]);
    console.log("Resultado da exclusão:", result); // Logando o resultado da exclusão

    // Verifica se algum produto foi excluído
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.status(200).json({ message: 'Produto excluído com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    res.status(500).json({ error: error.message });
  }
};

// Função para pesquisar produtos por nome
export const searchProdutos = async (req, res) => {
  const { nome } = req.query;
  try {
    const [result] = await db.execute(
      'SELECT * FROM produtos WHERE nome LIKE ?',
      [`%${nome}%`]
    );
    res.json(result);
  } catch (error) {
    console.error('Erro ao pesquisar produtos:', error);
    res.status(500).json({ error: error.message });
  }
};


