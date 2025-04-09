import express from 'express';
import { getProdutos, addProduto } from '../controllers/produtoController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
const router = express.Router();

router.get('/', authenticateToken, getProdutos);
router.post('/', authenticateToken, addProduto);

export default router;
