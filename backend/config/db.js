import mysql from 'mysql2/promise';
import { env } from './env.js';

const pool = mysql.createPool({
  host: env.dbHost,
  user: env.dbUser,
  password: env.dbPassword,
  database: env.dbName,
  waitForConnections: true,
  connectionLimit: 10, // Pode ajustar conforme o número de conexões simultâneas esperadas
  queueLimit: 0,
  multipleStatements: true,
});

export default pool;
