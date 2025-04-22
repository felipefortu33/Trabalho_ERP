import db from '../config/db.js';

const tables = [
  `CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    endereco TEXT,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    contato VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    endereco TEXT,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(255),
    preco DECIMAL(10,2) NOT NULL,
    estoque INT NOT NULL,
    url LONGTEXT,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT,
  data DATETIME DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'Pendente',
  data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  estoque_baixado BOOLEAN DEFAULT FALSE,
  FOREIGN KEY(cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
)`,
  `CREATE TABLE IF NOT EXISTS pedido_produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT,
    produto_id INT,
    quantidade INT,
    FOREIGN KEY(pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY(produto_id) REFERENCES produtos(id) ON DELETE CASCADE
  )`
];


export const createTables = async () => {
  for (const query of tables) {
    await db.execute(query);
  }
};
