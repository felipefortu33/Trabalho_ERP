import 'dotenv/config';
import { createTables } from './models/createTables.js';
import { env } from './config/env.js';
import app from './app.js';

await createTables();

app.listen(env.port, () => {
  console.log(`Servidor rodando na porta ${env.port}`);
});
