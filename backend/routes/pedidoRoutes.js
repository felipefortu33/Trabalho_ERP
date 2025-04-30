import express from 'express';
import {
  getPedidos,
  addPedido,
  updatePedido,
  deletePedido,
  addPedidoMultiplo,
  getPedidoById
} from '../controllers/pedidoController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: Endpoints para gerenciamento de pedidos
 */

/**
 * @swagger
 * /pedidos:
 *   get:
 *     summary: Lista todos os pedidos
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos
 */

/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cliente
 *               - itens
 *             properties:
 *               cliente:
 *                 type: string
 *               itens:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     produto:
 *                       type: string
 *                     quantidade:
 *                       type: number
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 */

/**
 * @swagger
 * /pedidos/{id}:
 *   get:
 *     summary: Retorna um pedido por ID
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do pedido
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados do pedido
 *       404:
 *         description: Pedido não encontrado
 */

/**
 * @swagger
 * /pedidos/{id}:
 *   put:
 *     summary: Atualiza um pedido existente
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do pedido
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cliente:
 *                 type: string
 *               itens:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     produto:
 *                       type: string
 *                     quantidade:
 *                       type: number
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *       404:
 *         description: Pedido não encontrado
 */

/**
 * @swagger
 * /pedidos/{id}:
 *   delete:
 *     summary: Exclui um pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do pedido
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido excluído com sucesso
 *       404:
 *         description: Pedido não encontrado
 */

/**
 * @swagger
 * /pedidos/multiplos:
 *   post:
 *     summary: Cria múltiplos pedidos em lote
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 cliente:
 *                   type: string
 *                 itens:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       produto:
 *                         type: string
 *                       quantidade:
 *                         type: number
 *     responses:
 *       201:
 *         description: Pedidos criados com sucesso
 */

router.get('/', authenticateToken, getPedidos);
router.post('/', authenticateToken, addPedido);
router.put('/:id', authenticateToken, updatePedido);
router.delete('/:id', authenticateToken, deletePedido);
router.post('/multiplos', authenticateToken, addPedidoMultiplo);
router.get('/:id', authenticateToken, getPedidoById);

export default router;
