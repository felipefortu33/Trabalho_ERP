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

// Rota para buscar todos os clientes
router.get('/', authenticateToken, getClientes);

// Rota para adicionar um novo cliente
router.post('/', authenticateToken, addCliente);

// Rota para editar um cliente específico
router.put('/:id', authenticateToken, editCliente);

// Rota para excluir um cliente específico
router.delete('/:id', authenticateToken, deleteCliente);

// Rota para pesquisar clientes por nome
router.get('/search', authenticateToken, searchClientes);

export default router;
