import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// Rota para registrar usuário
router.post('/register', register);

// Rota para login
router.post('/login', login);

export default router;
