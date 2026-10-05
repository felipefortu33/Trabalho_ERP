import 'dotenv/config';
import { runMigrations } from './db/migrate.js';
import { env } from './config/env.js';
import app from './app.js';

await runMigrations();

app.listen(env.port, () => {
  console.log(`Servidor rodando na porta ${env.port}`);
});
