import db from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { sendInternalError } from '../middlewares/errorHandler.js';

// Registro de usuário
export const register = async (req, res) => {
  const { nome, email, senha } = req.body;
  const hashedPassword = await bcrypt.hash(senha, 10);

  

  try {
    await db.execute('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, hashedPassword]);
    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    sendInternalError(res, error, 'Erro ao registrar usuario');
  }
};

// Login de usuário
export const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const [rows] = await db.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, env.secretKey, { expiresIn: '1h' });

    res.json({ message: 'Login bem-sucedido', token });
  } catch (error) {
    sendInternalError(res, error, 'Erro no login');
  }
};
