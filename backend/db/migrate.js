import fs from 'node:fs/promises';
import path from 'node:path';
import db from '../config/db.js';

const migrationsDirectory = path.resolve(process.cwd(), 'db', 'migrations');

export const runMigrations = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const [appliedRows] = await db.execute('SELECT name FROM schema_migrations ORDER BY name');
  const applied = new Set(appliedRows.map(({ name }) => name));
  const migrationNames = (await fs.readdir(migrationsDirectory))
    .filter((name) => name.endsWith('.sql'))
    .sort();

  for (const name of migrationNames) {
    if (applied.has(name)) continue;

    const sql = await fs.readFile(path.join(migrationsDirectory, name), 'utf8');
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();
      await connection.query(sql);
      await connection.execute('INSERT INTO schema_migrations (name) VALUES (?)', [name]);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new Error(`Falha ao aplicar migration ${name}: ${error.message}`, { cause: error });
    } finally {
      connection.release();
    }
  }
};
