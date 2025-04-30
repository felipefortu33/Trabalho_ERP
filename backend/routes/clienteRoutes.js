import express from 'express';
import {
  getClientes,
  addCliente,
  editCliente,
  deleteCliente,
  searchClientes,
} from '../controllers/clienteController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: Endpoints para gerenciamento de clientes
 */

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Retorna todos os clientes
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Adiciona um novo cliente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - telefone
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               telefone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /clientes/{id}:
 *   put:
 *     summary: Edita um cliente existente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do cliente
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               telefone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente atualizado
 *       404:
 *         description: Cliente não encontrado
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /clientes/{id}:
 *   delete:
 *     summary: Exclui um cliente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do cliente
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliente excluído com sucesso
 *       404:
 *         description: Cliente não encontrado
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /clientes/search:
 *   get:
 *     summary: Pesquisa clientes por nome
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: nome
 *         in: query
 *         required: true
 *         description: Nome do cliente para buscar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de clientes encontrados
 *       401:
 *         description: Não autorizado
 */

router.get('/', authenticateToken, getClientes);
router.post('/', authenticateToken, addCliente);
router.put('/:id', authenticateToken, editCliente);
router.delete('/:id', authenticateToken, deleteCliente);
router.get('/search', authenticateToken, searchClientes);

export default router;
