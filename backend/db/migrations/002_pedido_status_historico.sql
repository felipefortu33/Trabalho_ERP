CREATE TABLE IF NOT EXISTS pedido_status_historico (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  status_anterior VARCHAR(50) NOT NULL,
  status_novo VARCHAR(50) NOT NULL,
  alterado_por INT,
  alterado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_pedido_status_historico_pedido (pedido_id),
  KEY idx_pedido_status_historico_data (alterado_em),
  CONSTRAINT fk_pedido_status_historico_pedido
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  CONSTRAINT fk_pedido_status_historico_usuario
    FOREIGN KEY (alterado_por) REFERENCES usuarios(id) ON DELETE SET NULL
);
