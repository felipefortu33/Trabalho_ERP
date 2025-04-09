import db from '../config/db.js';

const tables = [
  `CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      senha VARCHAR(255) NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS clientes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      contato VARCHAR(255)
  )`,
  `CREATE TABLE IF NOT EXISTS produtos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      preco DECIMAL(10,2) NOT NULL,
      estoque INT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS pedidos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      cliente_id INT,
      produto_id INT,
      data DATETIME,
      quantidade INT,
      FOREIGN KEY(cliente_id) REFERENCES clientes(id),
      FOREIGN KEY(produto_id) REFERENCES produtos(id)
  )`
];

export const createTables = async () => {
  for (const query of tables) {
    await db.execute(query);
  }
};
