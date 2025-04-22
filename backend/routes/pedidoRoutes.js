import express from 'express';
import { getPedidos, addPedido, updatePedido, deletePedido } from '../controllers/pedidoController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { addPedidoMultiplo } from '../controllers/pedidoController.js';
import { getPedidoById } from '../controllers/pedidoController.js';


const router = express.Router();

router.get('/', authenticateToken, getPedidos);
router.post('/', authenticateToken, addPedido);
router.put('/:id', authenticateToken, updatePedido);
router.delete('/:id', authenticateToken, deletePedido);
router.post('/multiplos', authenticateToken, addPedidoMultiplo);
router.get('/:id', authenticateToken, getPedidoById);



export default router;
