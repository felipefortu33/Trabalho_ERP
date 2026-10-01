import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import authRoutes from './routes/authRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';
import produtoRoutes from './routes/produtoRoutes.js';
import pedidoRoutes from './routes/pedidoRoutes.js';
import { createTables } from './models/createTables.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { authenticateToken } from './middlewares/authenticateToken.js';
import financeiroRoutes from './routes/financeiroRoutes.js';
import setupSwagger from './swagger.js';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json()); // Use express.json() ao invés de bodyParser.json()

await createTables();
setupSwagger(app);

// Rotas
app.use('/auth', authRoutes);
app.use('/clientes', clienteRoutes);
app.use('/produtos', produtoRoutes);
app.use('/pedidos', pedidoRoutes);
app.use('/dashboard', authenticateToken, dashboardRoutes);
app.use('/financeiro', authenticateToken, financeiroRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Servidor rodando na porta ${env.port}`);
});
