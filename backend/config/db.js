import mysql from 'mysql2/promise';
import 'dotenv/config';

const db = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'erp_db'
});

export default db;
