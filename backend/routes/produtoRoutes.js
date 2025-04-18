import express from 'express';
import { getProdutos, addProduto, updateProduto, deleteProduto, searchProdutos } from '../controllers/produtoController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import upload from '../middlewares/upload.js';

const router = express.Router();



router.put('/:id', authenticateToken, updateProduto);
router.delete('/:id', authenticateToken, deleteProduto);
router.get('/search', authenticateToken, searchProdutos);
router.post('/', authenticateToken, upload.single('imagem'), addProduto);
router.put('/:id', authenticateToken, upload.single('imagem'), updateProduto);


export default router;
