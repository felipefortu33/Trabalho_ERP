import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Autenticação
 *     description: Endpoints de autenticação do usuário
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Autenticação]
 *     responses:
 *       200:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Dados inválidos
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Realiza login do usuário
 *     tags: [Autenticação]
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */

// Rota para registrar usuário
router.post('/register', register);

// Rota para login
router.post('/login', login);

export default router;
