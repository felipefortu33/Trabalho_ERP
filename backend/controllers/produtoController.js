import db from '../config/db.js';
import { sendInternalError } from '../middlewares/errorHandler.js';
import { getUploadedFileUrl, removeUploadedFile } from '../middlewares/upload.js';

// Função para buscar todos os produtos
export const getProdutos = async (req, res) => {
  try {
    const [produtos] = await db.execute('SELECT * FROM produtos');
    res.json(produtos);
  } catch (error) {
    sendInternalError(res, error, 'Erro ao buscar produtos');
  }
};

// Função para adicionar um produto
export const addProduto = async (req, res) => {
  const { nome, descricao, categoria, preco, estoque } = req.body;
  const url = getUploadedFileUrl(req.file);

  try {
    await db.execute(
      'INSERT INTO produtos (nome, descricao, categoria, preco, estoque, url) VALUES (?, ?, ?, ?, ?, ?)',
      [nome, descricao, categoria, parseFloat(preco), parseInt(estoque), url]
    );
    res.status(201).json({ message: 'Produto adicionado com sucesso!' });
  } catch (error) {
    await removeUploadedFile(url);
    sendInternalError(res, error, 'Erro ao adicionar produto');
  }
};

// Função para atualizar um produto
export const updateProduto = async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, categoria, preco, estoque } = req.body;

  try {
    const [produtos] = await db.execute('SELECT url FROM produtos WHERE id = ?', [id]);
    if (produtos.length === 0) {
      await removeUploadedFile(getUploadedFileUrl(req.file));
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    const previousUrl = produtos[0].url;
    const url = getUploadedFileUrl(req.file) || previousUrl;
    const query = `
      UPDATE produtos 
      SET nome = ?, descricao = ?, categoria = ?, preco = ?, estoque = ?, url = ? 
      WHERE id = ?
    `;

    const [resultado] = await db.execute(query, [
      nome,
      descricao,
      categoria,
      parseFloat(preco), // Converte para número
      parseInt(estoque), // Converte para número
      url,
      id
    ]);

    if (resultado.affectedRows === 0) {
      await removeUploadedFile(url);
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    if (req.file && previousUrl !== url) {
      await removeUploadedFile(previousUrl);
    }
    res.status(200).json({ message: "Produto atualizado com sucesso!" });
  } catch (error) {
    await removeUploadedFile(getUploadedFileUrl(req.file));
    sendInternalError(res, error, 'Erro ao atualizar produto');
  }
};

// Função para excluir um produto
export const deleteProduto = async (req, res) => {
  const { id } = req.params;

  try {
    // Verifica se o ID é válido
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const [produtos] = await db.execute('SELECT url FROM produtos WHERE id = ?', [id]);

    if (produtos.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    const [result] = await db.execute('DELETE FROM produtos WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    await removeUploadedFile(produtos[0].url);
    res.status(200).json({ message: 'Produto excluído com sucesso!' });
  } catch (error) {
    sendInternalError(res, error, 'Erro ao excluir produto');
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
    sendInternalError(res, error, 'Erro ao pesquisar produtos');
  }
};