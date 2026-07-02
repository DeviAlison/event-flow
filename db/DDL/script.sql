SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE DATABASE IF NOT EXISTS eventos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE eventos;

CREATE TABLE IF NOT EXISTS eventos.usuarios (
  idusuarios INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(45) NOT NULL,
  sobrenome VARCHAR(45) NOT NULL, 
  email VARCHAR(45) NOT NULL,
  senha VARCHAR(256) NOT NULL,
  telefone VARCHAR(45) NOT NULL,
  perfil ENUM('usuario', 'admin') NOT NULL DEFAULT 'usuario',
  tipo_conta ENUM('PF', 'PJ') NOT NULL,
  documento VARCHAR(20) NOT NULL,
  email_verificado TINYINT(1) NOT NULL DEFAULT 0,
  UNIQUE INDEX uk_email_unico (email ASC) VISIBLE,        
  UNIQUE INDEX uk_documento_unico (documento ASC) VISIBLE,
  PRIMARY KEY (idusuarios)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS eventos.tokens (
  idtoken INT NOT NULL AUTO_INCREMENT,
  codigo CHAR(6) NOT NULL,
  tipo ENUM('confirmacao_email', 'recuperacao_senha') NOT NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expira_em DATETIME NOT NULL,
  usado TINYINT(1) NOT NULL DEFAULT 0,
  usuarios_idusuarios INT NOT NULL,
  PRIMARY KEY (idtoken),
  INDEX fk_tokens_usuarios1_idx (usuarios_idusuarios ASC) VISIBLE,
  CONSTRAINT fk_tokens_usuarios1
    FOREIGN KEY (usuarios_idusuarios)
    REFERENCES eventos.usuarios (idusuarios)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS eventos.categoria (
  idcatEvento INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(45) NOT NULL,
  PRIMARY KEY (idcatEvento)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS eventos.sub_categoria (
  idsub_categoria INT NOT NULL AUTO_INCREMENT,
  genero VARCHAR(45) NOT NULL,
  categoria_idcatEvento INT NOT NULL,
  PRIMARY KEY (idsub_categoria),
  INDEX fk_sub_categoria_categoria1_idx (categoria_idcatEvento ASC) VISIBLE,
  CONSTRAINT fk_sub_categoria_categoria1
    FOREIGN KEY (categoria_idcatEvento)
    REFERENCES eventos.categoria (idcatEvento)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS eventos.met_pagamentos (
  idmet_pagamentos INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(45) NOT NULL,
  descricao VARCHAR(45) NULL,
  ativo TINYINT NOT NULL,
  taxa_perc DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  taxa DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (idmet_pagamentos)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS eventos.eventos (
  ideventos INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(45) NOT NULL,
  descricao VARCHAR(500) NOT NULL,
  imagem_url VARCHAR(500) NULL,  
  data_inicio DATETIME NOT NULL,
  data_encerramento DATETIME NOT NULL,
  tipo_evento VARCHAR(45) NOT NULL,
  nome_local VARCHAR(45) NOT NULL,
  endereco VARCHAR(45) NOT NULL,
  numero_end INT NOT NULL,
  cidade VARCHAR(45) NOT NULL,
  estado CHAR(2) NOT NULL,
  quant_pessoas INT NOT NULL,
  status ENUM('publicado', 'encerrado', 'cancelado') NOT NULL DEFAULT 'publicado',
  usuarios_idusuarios INT NOT NULL,
  -- A COLUNA DA CATEGORIA FOI REMOVIDA E SUBSTITUÍDA PELA SUBCATEGORIA
  sub_categoria_idsub_categoria INT NOT NULL,
  
  PRIMARY KEY (ideventos),
  INDEX fk_eventos_usuarios_idx (usuarios_idusuarios ASC) VISIBLE,
  INDEX fk_eventos_subcategoria_idx (sub_categoria_idsub_categoria ASC) VISIBLE,
  INDEX idx_filtro_busca (estado ASC, cidade ASC, status ASC) VISIBLE,
  FULLTEXT INDEX ft_idx_nome_descricao (nome, descricao),
  
  CONSTRAINT fk_eventos_usuarios
    FOREIGN KEY (usuarios_idusuarios)
    REFERENCES eventos.usuarios (idusuarios)
    ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT fk_eventos_subcategoria
    FOREIGN KEY (sub_categoria_idsub_categoria)
    REFERENCES eventos.sub_categoria (idsub_categoria)
    ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS eventos.comentarios (
  idcomentario INT NOT NULL AUTO_INCREMENT,
  texto VARCHAR(200) NOT NULL,
  data_comentario DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado DATETIME NULL,
  comentariopai INT NULL, 
  eventos_ideventos INT NOT NULL,
  usuarios_idusuarios INT NOT NULL,
  PRIMARY KEY (idcomentario),
  INDEX fk_comentario_eventos1_idx (eventos_ideventos ASC) VISIBLE,
  INDEX fk_comentario_usuarios1_idx (usuarios_idusuarios ASC) VISIBLE,
  INDEX fk_comentario_pai_idx (comentariopai ASC) VISIBLE,
  CONSTRAINT fk_comentario_eventos1
    FOREIGN KEY (eventos_ideventos)
    REFERENCES eventos.eventos (ideventos)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_comentario_usuarios1
    FOREIGN KEY (usuarios_idusuarios)
    REFERENCES eventos.usuarios (idusuarios)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_comentario_pai
    FOREIGN KEY (comentariopai)
    REFERENCES eventos.comentarios (idcomentario)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS eventos.curtidas (
  idcurtidas INT NOT NULL AUTO_INCREMENT,
  data_curtidas DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  eventos_ideventos INT NOT NULL,
  usuarios_idusuarios INT NOT NULL,
  PRIMARY KEY (idcurtidas),
  INDEX fk_like_eventos1_idx (eventos_ideventos ASC) VISIBLE,
  INDEX fk_like_usuarios1_idx (usuarios_idusuarios ASC) VISIBLE,
  UNIQUE INDEX uk_curtida_unica (eventos_ideventos ASC, usuarios_idusuarios ASC) VISIBLE,
  CONSTRAINT fk_like_eventos1
    FOREIGN KEY (eventos_ideventos)
    REFERENCES eventos.eventos (ideventos)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_like_usuarios1
    FOREIGN KEY (usuarios_idusuarios)
    REFERENCES eventos.usuarios (idusuarios)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS eventos.tipo_ingresso (
  idtipo_ingresso INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(45) NOT NULL,
  descricao VARCHAR(45) NULL,
  permite_meia TINYINT NOT NULL,
  percentual_meia DECIMAL(5,2) NOT NULL,
  eventos_ideventos INT NOT NULL,
  PRIMARY KEY (idtipo_ingresso),
  INDEX fk_Tipo_Ingresso_eventos1_idx (eventos_ideventos ASC) VISIBLE,
  CONSTRAINT fk_Tipo_Ingresso_eventos1
    FOREIGN KEY (eventos_ideventos)
    REFERENCES eventos.eventos (ideventos)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS eventos.lote (
  idLote INT NOT NULL AUTO_INCREMENT,
  numero_lote INT NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  preco_meia DECIMAL(10,2) NULL,
  quant_total INT NOT NULL,
  quant_vendida INT NOT NULL,
  quant_meia_total INT NOT NULL,
  quant_meia_vendida INT NOT NULL,
  inicio_vendas DATETIME NOT NULL,
  fim_vendas DATETIME NOT NULL,
  tipo_ingresso_idTipo_Ingresso INT NOT NULL,
  PRIMARY KEY (idLote),
  INDEX fk_Lote_tipo_ingresso1_idx (tipo_ingresso_idTipo_Ingresso ASC) VISIBLE,
  CONSTRAINT fk_Lote_tipo_ingresso1
    FOREIGN KEY (tipo_ingresso_idTipo_Ingresso)
    REFERENCES eventos.tipo_ingresso (idtipo_ingresso)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS eventos.pedidos (
  idpedidos INT NOT NULL AUTO_INCREMENT,
  status ENUM('pendente', 'pago', 'cancelado') NOT NULL DEFAULT 'pendente',
  valor_total DECIMAL(10,2) NOT NULL,
  desconto DECIMAL(10,2) NULL,
  cupom VARCHAR(45) NULL,
  usuarios_idusuarios INT NOT NULL,
  PRIMARY KEY (idpedidos),
  INDEX fk_Pedidos_usuarios1_idx (usuarios_idusuarios ASC) VISIBLE,
  CONSTRAINT fk_Pedidos_usuarios1
    FOREIGN KEY (usuarios_idusuarios)
    REFERENCES eventos.usuarios (idusuarios)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS eventos.itens_pedidos (
  iditens_pedidos INT NOT NULL AUTO_INCREMENT,
  quantidade INT NOT NULL,
  preco_unit DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  pedidos_idpedidos INT NOT NULL,
  lote_idLote INT NOT NULL,
  PRIMARY KEY (iditens_pedidos),
  INDEX fk_Itens_pedidos_Pedidos1_idx (pedidos_idpedidos ASC) VISIBLE,
  INDEX fk_itens_pedidos_lote1_idx (lote_idLote ASC) VISIBLE,
  CONSTRAINT fk_Itens_pedidos_Pedidos1
    FOREIGN KEY (pedidos_idpedidos)
    REFERENCES eventos.pedidos (idpedidos)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_itens_pedidos_lote1
    FOREIGN KEY (lote_idLote)
    REFERENCES eventos.lote (idLote)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS eventos.ingressos (
  idingressos INT NOT NULL AUTO_INCREMENT,
  status ENUM('valido', 'utilizado', 'cancelado') NOT NULL DEFAULT 'valido',
  dataComp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  codigoQr TEXT NULL,
  Itens_pedidos_idItens_pedidos INT NOT NULL,
  PRIMARY KEY (idingressos),
  INDEX fk_ingressos_Itens_pedidos1_idx (Itens_pedidos_idItens_pedidos ASC) VISIBLE,
  CONSTRAINT fk_ingressos_Itens_pedidos1
    FOREIGN KEY (Itens_pedidos_idItens_pedidos)
    REFERENCES eventos.itens_pedidos (iditens_pedidos)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS eventos.pagamento (
  idpagamento INT NOT NULL AUTO_INCREMENT,
  status ENUM('aprovado', 'pendente', 'reembolsado') NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  valor_taxa DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  valor_total DECIMAL(10,2) NOT NULL,
  data_pag DATETIME NOT NULL,
  pedidos_idpedidos INT NOT NULL,
  met_pagamentos_idmet_pagamentos INT NOT NULL,
  PRIMARY KEY (idpagamento),
  INDEX fk_Pagamento_Pedidos1_idx (pedidos_idpedidos ASC) VISIBLE,
  INDEX fk_pagamento_met_pagamentos1_idx (met_pagamentos_idmet_pagamentos ASC) VISIBLE,
  CONSTRAINT fk_Pagamento_Pedidos1
    FOREIGN KEY (pedidos_idpedidos)
    REFERENCES eventos.pedidos (idpedidos)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_pagamento_met_pagamentos1
    FOREIGN KEY (met_pagamentos_idmet_pagamentos)
    REFERENCES eventos.met_pagamentos (idmet_pagamentos)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS eventos.pagamento_cartao (
  idpagamento_cartao INT AUTO_INCREMENT PRIMARY KEY,
  pagamento_idpagamento INT NOT NULL,
  numero_cartao VARCHAR(20) NOT NULL,
  banco VARCHAR(45) NOT NULL,
  cv INT NOT NULL,
  validade DATE NOT NULL,
  titular VARCHAR(100) NOT NULL,
  tipo_cartao ENUM('credito', 'debito') NOT NULL DEFAULT 'credito',
  salvo TINYINT(1) NOT NULL DEFAULT 0,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_pagamento_cartao_pagamento (pagamento_idpagamento ASC) VISIBLE,
  CONSTRAINT fk_pagamento_cartao_pagamento
    FOREIGN KEY (pagamento_idpagamento)
    REFERENCES eventos.pagamento (idpagamento)
    ON DELETE CASCADE 
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS eventos.pagamento_pix (
  idpagamento_pix INT AUTO_INCREMENT PRIMARY KEY,
  pagamento_idpagamento INT NOT NULL,
  chave_pix VARCHAR(255) NOT NULL,
  tipo_chave ENUM('cpf', 'email', 'telefone', 'aleatoria') NOT NULL,
  qr_code VARCHAR(255) DEFAULT NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_pagamento_pix_pagamento (pagamento_idpagamento ASC) VISIBLE,
  CONSTRAINT fk_pagamento_pix_pagamento
    FOREIGN KEY (pagamento_idpagamento)
    REFERENCES eventos.pagamento (idpagamento)
    ON DELETE CASCADE 
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS eventos.pagamento_boleto (
  idpagamento_boleto INT AUTO_INCREMENT PRIMARY KEY,
  pagamento_idpagamento INT NOT NULL,
  codigo_banco CHAR(3) NOT NULL,
  agencia VARCHAR(10) NOT NULL,
  conta VARCHAR(20) NOT NULL,
  numero_boleto VARCHAR(50) NOT NULL UNIQUE,
  vencimento DATE NOT NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_pagamento_boleto_pagamento (pagamento_idpagamento ASC) VISIBLE,
  CONSTRAINT fk_pagamento_boleto_pagamento
    FOREIGN KEY (pagamento_idpagamento)
    REFERENCES eventos.pagamento (idpagamento)
    ON DELETE CASCADE 
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- 1. USUÁRIOS 
INSERT INTO usuarios (idusuarios, nome, sobrenome, email, senha, telefone, perfil, tipo_conta, documento, email_verificado) VALUES
(1, 'Administrador', 'Silva', 'admin@eventos.com', '123', '11999999999', 'admin', 'PJ', '12345678901', 1),
(2, 'João', 'Cliente', 'joao@email.com', '123', '11988888888', 'usuario', 'PF', '98765432100', 1),
(3, 'Empresa', 'Promoções', 'contato@promocoes.com', '123', '1133334444', 'admin', 'PJ', '11222333000199', 1),
(4, 'Maria', 'Oliveira', 'maria@email.com', '123', '11977777777', 'usuario', 'PF', '12312312344', 1),
(5, 'Carlos', 'Santos', 'carlos@email.com', '123', '11966666666', 'usuario', 'PF', '32132132155', 1),
(6, 'Ana', 'Costa', 'ana@email.com', '123', '11955555555', 'usuario', 'PF', '45645645666', 0),
(7, 'Pedro', 'Gomes', 'pedro@email.com', '123', '11944444444', 'usuario', 'PF', '78978978977', 1),
(8, 'Lucas', 'Martins', 'lucas@email.com', '123', '11933333333', 'usuario', 'PF', '15915915988', 1);

-- 2. CATEGORIAS 
INSERT INTO categoria (idcatEvento, nome) VALUES
(1, 'Música e Shows'),
(2, 'Tecnologia e Inovação'),
(3, 'Esportes'),
(4, 'Teatro e Artes'),
(5, 'Gastronomia');

-- 3. SUB-CATEGORIAS 
INSERT INTO sub_categoria (idsub_categoria, genero, categoria_idcatEvento) VALUES
(1, 'Rock', 1),
(2, 'Sertanejo', 1),
(3, 'Eletrônica', 1),
(4, 'Desenvolvimento de Software', 2),
(5, 'Inteligência Artificial', 2),
(6, 'Futebol', 3),
(7, 'Corrida de Rua', 3),
(8, 'Stand-up Comedy', 4),
(9, 'Drama', 4),
(10, 'Festival de Carnes', 5);

-- 4. MÉTODOS DE PAGAMENTO 
INSERT INTO met_pagamentos (idmet_pagamentos, nome, descricao, ativo, taxa_perc, taxa) VALUES
(1, 'Cartão de Crédito', 'Pagamento via Cartão', 1, 5.00, 0.00),
(2, 'PIX', 'Pagamento Instantâneo', 1, 0.00, 0.00),
(3, 'Boleto Bancário', 'Vencimento em 3 dias', 1, 0.00, 2.50);

-- 5. EVENTOS 
INSERT INTO eventos (ideventos, nome, descricao, imagem_url, data_inicio, data_encerramento, tipo_evento, nome_local, endereco, numero_end, cidade, estado, quant_pessoas, status, usuarios_idusuarios, sub_categoria_idsub_categoria) VALUES
(1, 'Festival Rock 2026', 'Múltiplos lotes.', NULL, '2026-10-15 18:00:00', '2026-10-16 02:00:00', 'Show', 'Arena Central', 'Av. das Nações', 1000, 'São Paulo', 'SP', 15000, 'publicado', 1, 1),
(2, 'Tech Summit Brasil', 'Congresso.', NULL, '2026-08-20 09:00:00', '2026-08-22 18:00:00', 'Congresso', 'Centro de Convenções', 'Rua da Inovação', 500, 'Campinas', 'SP', 3000, 'publicado', 3, 4),
(3, 'Final do Campeonato', 'Futebol.', NULL, '2026-11-10 16:00:00', '2026-11-10 18:00:00', 'Jogo', 'Estádio Municipal', 'Rua do Gol', 10, 'Rio de Janeiro', 'RJ', 50000, 'publicado', 1, 6),
(4, 'Noite de Risadas', 'Stand-up.', NULL, '2026-09-05 20:00:00', '2026-09-05 23:00:00', 'Teatro', 'Teatro do Riso', 'Rua da Alegria', 120, 'Curitiba', 'PR', 800, 'publicado', 3, 8),
(5, 'Feira Gastronômica', 'Carnes.', NULL, '2026-05-10 10:00:00', '2026-05-12 22:00:00', 'Feira', 'Praça Central', 'Av. das Flores', 1, 'Belo Horizonte', 'MG', 5000, 'encerrado', 1, 10),
(6, 'AI Bootcamp', 'IA.', NULL, '2026-12-01 08:00:00', '2026-12-05 18:00:00', 'Workshop', 'Prédio Comercial', 'Av. Paulista', 2000, 'São Paulo', 'SP', 100, 'cancelado', 3, 5);

-- 6. TIPOS DE INGRESSO 
INSERT INTO tipo_ingresso (idtipo_ingresso, nome, descricao, permite_meia, percentual_meia, eventos_ideventos) VALUES
(1, 'Pista Premium', 'Perto do palco', 1, 50.00, 1),
(2, 'Pista Comum', 'Acesso geral', 1, 50.00, 1),
(3, 'Passaporte 3 Dias', 'Congresso completo', 1, 50.00, 2),
(4, 'Arquibancada', 'Visão superior', 1, 50.00, 3),
(5, 'Cadeira VIP', 'Poltrona numerada', 1, 50.00, 4),
(6, 'Entrada Geral', 'Acesso livre à feira', 0, 0.00, 5);

-- 7. LOTES (8 Registros solicitados)
INSERT INTO lote (idLote, numero_lote, preco, preco_meia, quant_total, quant_vendida, quant_meia_total, quant_meia_vendida, inicio_vendas, fim_vendas, tipo_ingresso_idTipo_Ingresso) VALUES
(1, 1, 300.00, 150.00, 1000, 1000, 500, 500, '2026-01-01', '2026-02-01', 1), -- Lote 1 da Pista Premium (Esgotado)
(2, 2, 400.00, 200.00, 1000, 200, 500, 50, '2026-02-02', '2026-05-01', 1),  -- Lote 2 da Pista Premium
(3, 1, 150.00, 75.00, 5000, 3000, 2000, 1000, '2026-01-01', '2026-05-01', 2), -- Lote 1 da Pista Comum
(4, 1, 110.00, 55.00, 1000, 400, 300, 100, '2026-04-01', '2026-07-20', 3),   -- Lote 1 do Passaporte Tech
(5, 1, 80.00, 40.00, 20000, 15000, 5000, 4500, '2026-05-01', '2026-11-09', 4), -- Lote 1 da Arquibancada
(6, 1, 120.00, 60.00, 800, 100, 200, 50, '2026-06-01', '2026-09-04', 5),     -- Lote 1 do Stand-up
(7, 1, 20.00, NULL, 3000, 3000, 0, 0, '2026-01-01', '2026-03-01', 6),        -- Lote 1 da Feira Gastronômica (Esgotado)
(8, 2, 35.00, NULL, 2000, 1500, 0, 0, '2026-03-02', '2026-05-09', 6);        -- Lote 2 da Feira Gastronômica



-- Pedidos (4 registros)
INSERT INTO pedidos (idpedidos, status, valor_total, desconto, cupom, usuarios_idusuarios) VALUES
(1, 'pago', 450.00, 0.00, NULL, 2),
(2, 'pago', 110.00, 0.00, NULL, 4),
(3, 'pendente', 80.00, 0.00, NULL, 5),
(4, 'cancelado', 300.00, 0.00, NULL, 7);

-- Itens dos Pedidos
INSERT INTO itens_pedidos (iditens_pedidos, quantidade, preco_unit, subtotal, pedidos_idpedidos, lote_idLote) VALUES
(1, 1, 300.00, 300.00, 1, 1),
(2, 1, 150.00, 150.00, 1, 3),
(3, 1, 110.00, 110.00, 2, 4),
(4, 1, 80.00, 80.00, 3, 5),
(5, 1, 300.00, 300.00, 4, 1);

-- Pagamentos base
INSERT INTO pagamento (idpagamento, status, valor, valor_taxa, valor_total, data_pag, pedidos_idpedidos, met_pagamentos_idmet_pagamentos) VALUES
(1, 'aprovado', 450.00, 0.00, 450.00, '2026-06-09 10:00:00', 1, 2),
(2, 'aprovado', 110.00, 5.50, 115.50, '2026-06-10 11:30:00', 2, 1),
(3, 'pendente', 80.00, 2.00, 82.00, '2026-06-12 14:00:00', 3, 3);

-- Métodos Específicos de Pagamento
INSERT INTO pagamento_pix (pagamento_idpagamento, chave_pix, tipo_chave, qr_code) VALUES
(1, 'joao@email.com', 'email', 'QR_CODE_STRING_001');

INSERT INTO pagamento_cartao (pagamento_idpagamento, numero_cartao, banco, cv, validade, titular, tipo_cartao, salvo) VALUES
(2, '4532...1111', 'Visa', 123, '2028-12-31', 'Maria Oliveira', 'credito', 1);

INSERT INTO pagamento_boleto (pagamento_idpagamento, codigo_banco, agencia, conta, numero_boleto, vencimento) VALUES
(3, '033', '1001', '12345-X', '03399.1234567890.12345612345.123456198760000100000', '2026-07-10');

-- Ingressos gerados (Apenas para pedidos aprovados)
INSERT INTO ingressos (idingressos, status, dataComp, codigoQr, Itens_pedidos_idItens_pedidos) VALUES
(1, 'valido', '2026-06-09 10:05:00', 'QR_ROCK_001_ABC', 1),
(2, 'valido', '2026-06-09 10:05:00', 'QR_ROCK_002_DEF', 2),
(3, 'valido', '2026-06-10 11:35:00', 'QR_TECH_001_GHI', 3);

-- Tokens
INSERT INTO tokens (codigo, tipo, expira_em, usuarios_idusuarios, usado) VALUES
('111222', 'confirmacao_email', DATE_ADD(NOW(), INTERVAL 1 DAY), 2, 0),
('333444', 'confirmacao_email', DATE_SUB(NOW(), INTERVAL 1 DAY), 3, 0),
('555666', 'recuperacao_senha', DATE_ADD(NOW(), INTERVAL 1 HOUR), 5, 0),
('999888', 'recuperacao_senha', DATE_SUB(NOW(), INTERVAL 1 DAY), 2, 1);

-- Interações (Comentários e Curtidas)
INSERT INTO comentarios (texto, eventos_ideventos, usuarios_idusuarios) VALUES
('Estou muito ansioso para esse show!', 1, 2),
('Quais serão os palestrantes deste ano?', 2, 4);

INSERT INTO curtidas (data_curtidas, eventos_ideventos, usuarios_idusuarios) VALUES
('2026-06-05', 1, 2),
('2026-06-06', 1, 4),
('2026-06-07', 1, 5),
('2026-06-08', 1, 6),
('2026-06-05', 2, 8);

SELECT 
    ev.ideventos as ID, 
    ev.nome as Titulo, 
    MIN(l.preco) as "Preço Base",
    ev.status as "Status", 
    ROUND(((SUM(l.quant_vendida) + SUM(l.quant_meia_vendida)) / SUM(l.quant_total)) * 100, 2) as "Percentual Vendido", 
    cat.nome as Categoria,
    DATE(ev.data_inicio) as Data, 
    TIME(ev.data_inicio) as Hora, 
    ev.nome_local as "Local",  
    ev.endereco as "Rua", 
    ev.numero_end as "N°", 
    ev.cidade as Cidade, 
    ev.estado as Estado, 
    (SELECT COUNT(*) FROM curtidas c WHERE c.eventos_ideventos = ev.ideventos) as "Quantidade Reações"
FROM eventos ev
INNER JOIN tipo_ingresso tp ON ev.ideventos = tp.eventos_ideventos
INNER JOIN lote l ON tp.idtipo_ingresso = l.tipo_ingresso_idTipo_Ingresso
INNER JOIN sub_categoria sc ON ev.sub_categoria_idsub_categoria = sc.idsub_categoria
INNER JOIN categoria cat ON sc.categoria_idcatEvento = cat.idcatEvento
GROUP BY 
    ev.ideventos, 
    ev.nome, 
    ev.status, 
    cat.nome,
    DATE(ev.data_inicio), 
    TIME(ev.data_inicio), 
    ev.nome_local, 
    ev.endereco, 
    ev.numero_end, 
    ev.cidade, 
    ev.estado;
 