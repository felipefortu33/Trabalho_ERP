import express from 'express';
import { getPedidos, addPedido } from '../controllers/pedidoController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
const router = express.Router();

router.get('/', authenticateToken, getPedidos);
router.post('/', authenticateToken, addPedido);

export default router;
