import express from 'express';
import cors from 'cors';
import path from 'node:path';

import authRoutes from './routes/authRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';
import produtoRoutes from './routes/produtoRoutes.js';
import pedidoRoutes from './routes/pedidoRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { authenticateToken } from './middlewares/authenticateToken.js';
import financeiroRoutes from './routes/financeiroRoutes.js';
import setupSwagger from './swagger.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads'), {
  index: false,
  dotfiles: 'deny',
}));
setupSwagger(app);

app.use('/auth', authRoutes);
app.use('/clientes', clienteRoutes);
app.use('/produtos', produtoRoutes);
app.use('/pedidos', pedidoRoutes);
app.use('/dashboard', authenticateToken, dashboardRoutes);
app.use('/financeiro', authenticateToken, financeiroRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;