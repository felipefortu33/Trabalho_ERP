import express from 'express';
import {
  getProdutos,
  addProduto,
  updateProduto,
  deleteProduto,
  searchProdutos
} from '../controllers/produtoController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: Endpoints para gerenciamento de produtos
 */

/**
 * @swagger
 * /produtos:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de produtos
 */

/**
 * @swagger
 * /produtos/search:
 *   get:
 *     summary: Pesquisa produtos por nome
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: nome
 *         in: query
 *         required: true
 *         description: Nome do produto a ser buscado
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de produtos encontrados
 */

/**
 * @swagger
 * /produtos:
 *   post:
 *     summary: Adiciona um novo produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - preco
 *             properties:
 *               nome:
 *                 type: string
 *               preco:
 *                 type: number
 *               imagem:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 */

/**
 * @swagger
 * /produtos/{id}:
 *   put:
 *     summary: Atualiza um produto existente
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do produto
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               preco:
 *                 type: number
 *               imagem:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       404:
 *         description: Produto não encontrado
 */

/**
 * @swagger
 * /produtos/{id}:
 *   delete:
 *     summary: Exclui um produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do produto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produto excluído com sucesso
 *       404:
 *         description: Produto não encontrado
 */

router.get('/', authenticateToken, getProdutos);
router.get('/search', authenticateToken, searchProdutos);
router.post('/', authenticateToken, upload.single('imagem'), addProduto);
router.put('/:id', authenticateToken, upload.single('imagem'), updateProduto);
router.delete('/:id', authenticateToken, deleteProduto);

export default router;
