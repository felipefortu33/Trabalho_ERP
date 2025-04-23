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
import setupSwagger from './swagger.js';

const app = express();
const PORT = process.env.PORT || 5000;

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

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
