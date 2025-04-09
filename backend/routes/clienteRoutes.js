import express from 'express';
import { getClientes, addCliente } from '../controllers/clienteController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
const router = express.Router();

router.get('/', authenticateToken, getClientes);
router.post('/', authenticateToken, addCliente);

export default router;
