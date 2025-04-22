import mysql from 'mysql2/promise';
import 'dotenv/config';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'erp_db',
  waitForConnections: true,
  connectionLimit: 10, // Pode ajustar conforme o número de conexões simultâneas esperadas
  queueLimit: 0
});

export default pool;
