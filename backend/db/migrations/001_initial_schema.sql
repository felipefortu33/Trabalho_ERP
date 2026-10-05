CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  endereco TEXT,
  data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_usuarios_email (email)
);

CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  contato VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  endereco TEXT,
  data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_clientes_nome (nome),
  KEY idx_clientes_email (email)
);

CREATE TABLE IF NOT EXISTS produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  categoria VARCHAR(255),
  preco DECIMAL(10,2) NOT NULL,
  estoque INT NOT NULL,
  url VARCHAR(512),
  data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_produtos_nome (nome),
  KEY idx_produtos_categoria (categoria),
  CONSTRAINT chk_produtos_preco CHECK (preco >= 0),
  CONSTRAINT chk_produtos_estoque CHECK (estoque >= 0)
);

CREATE TABLE IF NOT EXISTS pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT,
  data DATETIME DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) NOT NULL DEFAULT 'Pendente',
  data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  estoque_baixado BOOLEAN NOT NULL DEFAULT FALSE,
  KEY idx_pedidos_cliente (cliente_id),
  KEY idx_pedidos_status (status),
  CONSTRAINT fk_pedidos_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pedido_produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  produto_id INT NOT NULL,
  quantidade INT NOT NULL,
  KEY idx_pedido_produtos_pedido (pedido_id),
  KEY idx_pedido_produtos_produto (produto_id),
  CONSTRAINT fk_pedido_produtos_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  CONSTRAINT fk_pedido_produtos_produto FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
  CONSTRAINT chk_pedido_produtos_quantidade CHECK (quantidade > 0)
);

CREATE TABLE IF NOT EXISTS contas_receber (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT,
  cliente_id INT,
  valor DECIMAL(10,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  status ENUM('pendente', 'pago', 'atrasado') NOT NULL DEFAULT 'pendente',
  forma_pagamento VARCHAR(50),
  KEY idx_contas_receber_pedido (pedido_id),
  KEY idx_contas_receber_cliente (cliente_id),
  KEY idx_contas_receber_status (status),
  CONSTRAINT fk_contas_receber_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE SET NULL,
  CONSTRAINT fk_contas_receber_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL,
  CONSTRAINT chk_contas_receber_valor CHECK (valor > 0)
);

CREATE TABLE IF NOT EXISTS contas_pagar (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descricao VARCHAR(255) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  status ENUM('pendente', 'pago', 'atrasado') NOT NULL DEFAULT 'pendente',
  fornecedor VARCHAR(255),
  categoria VARCHAR(100),
  forma_pagamento VARCHAR(50),
  KEY idx_contas_pagar_status (status),
  KEY idx_contas_pagar_vencimento (data_vencimento),
  CONSTRAINT chk_contas_pagar_valor CHECK (valor > 0)
);

CREATE TABLE IF NOT EXISTS fluxo_caixa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('entrada', 'saida') NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data DATE NOT NULL,
  descricao TEXT,
  categoria VARCHAR(100),
  referencia_id INT,
  referencia_tipo VARCHAR(50),
  KEY idx_fluxo_caixa_data (data),
  KEY idx_fluxo_caixa_tipo (tipo),
  CONSTRAINT chk_fluxo_caixa_valor CHECK (valor > 0)
);

CREATE TABLE IF NOT EXISTS categorias_financeiras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  tipo ENUM('receita', 'despesa') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_categorias_financeiras_nome_tipo (nome, tipo)
);

CREATE TABLE IF NOT EXISTS transacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT,
  tipo ENUM('entrada', 'saida') NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  descricao TEXT,
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY idx_transacoes_pedido (pedido_id),
  KEY idx_transacoes_data (data),
  CONSTRAINT fk_transacoes_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE SET NULL,
  CONSTRAINT chk_transacoes_valor CHECK (valor > 0)
);

CREATE TABLE IF NOT EXISTS receitas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY idx_receitas_pedido (pedido_id),
  CONSTRAINT fk_receitas_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
  CONSTRAINT chk_receitas_valor CHECK (valor > 0)
);
