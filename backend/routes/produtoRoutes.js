import express from 'express';
import { getProdutos, addProduto, updateProduto, deleteProduto, searchProdutos } from '../controllers/produtoController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// Rotas para produtos
router.get('/', authenticateToken, getProdutos); // Busca todos os produtos
router.get('/search', authenticateToken, searchProdutos); // Pesquisa produtos por nome
router.post('/', authenticateToken, upload.single('imagem'), addProduto); // Adiciona um novo produto
router.put('/:id', authenticateToken, upload.single('imagem'), updateProduto); // Atualiza um produto
router.delete('/:id', authenticateToken, deleteProduto); // Exclui um produto

export default router;