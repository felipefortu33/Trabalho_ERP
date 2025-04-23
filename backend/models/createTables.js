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
  )`,
  `CREATE TABLE IF NOT EXISTS contas_receber (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT,
  cliente_id INT,
  valor DECIMAL(10,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  status ENUM('pendente', 'pago', 'atrasado') DEFAULT 'pendente',
  forma_pagamento VARCHAR(50),
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE SET NULL,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL
)`,

`CREATE TABLE IF NOT EXISTS contas_pagar (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descricao VARCHAR(255) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  status ENUM('pendente', 'pago', 'atrasado') DEFAULT 'pendente',
  fornecedor VARCHAR(255),
  categoria VARCHAR(100),
  forma_pagamento VARCHAR(50)
)`,

`CREATE TABLE IF NOT EXISTS fluxo_caixa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('entrada', 'saida') NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data DATE NOT NULL,
  descricao TEXT,
  categoria VARCHAR(100),
  referencia_id INT,
  referencia_tipo VARCHAR(50)
)`,

`CREATE TABLE IF NOT EXISTS categorias_financeiras (
id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  tipo ENUM('receita', 'despesa') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS transacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT,
  tipo ENUM('entrada', 'saida') NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  descricao TEXT,
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE SET NULL
)`,
`CREATE TABLE IF NOT EXISTS receitas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
)`
];


export const createTables = async () => {
  for (const query of tables) {
    await db.execute(query);
  }
};
