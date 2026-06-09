-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema eventos
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema eventos
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `eventos` DEFAULT CHARACTER SET utf8 ;
USE `eventos` ;

-- -----------------------------------------------------
-- Table `eventos`.`usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eventos`.`usuarios` (
  `idusuarios` INT NOT NULL,
  `nome` VARCHAR(45) NULL,
  `email` VARCHAR(45) NULL,
  `senha` VARCHAR(256) NULL,
  `telefone` VARCHAR(45) NULL,
  `perfil` ENUM('Usuario', 'Admin') NULL,
  `documento` ENUM('CPF', 'CNPJ') NULL,
  PRIMARY KEY (`idusuarios`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `eventos`.`pedidos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eventos`.`pedidos` (
  `idpedidos` INT NOT NULL,
  `valor_total` DECIMAL(10,2) NULL,
  `desconto` DECIMAL(10,2) NULL,
  `cupom` VARCHAR(45) NULL,
  `usuarios_idusuarios` INT NOT NULL,
  PRIMARY KEY (`idpedidos`),
  INDEX `fk_Pedidos_usuarios1_idx` (`usuarios_idusuarios` ASC) VISIBLE,
  CONSTRAINT `fk_Pedidos_usuarios1`
    FOREIGN KEY (`usuarios_idusuarios`)
    REFERENCES `eventos`.`usuarios` (`idusuarios`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `eventos`.`itens_pedidos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eventos`.`itens_pedidos` (
  `iditens_pedidos` INT NOT NULL,
  `quantidade` INT NULL,
  `preco_unit` DECIMAL(10,2) NULL,
  `subtotall` DECIMAL(10,2) NULL,
  `pedidos_idpedidos` INT NOT NULL,
  PRIMARY KEY (`iditens_pedidos`),
  INDEX `fk_Itens_pedidos_Pedidos1_idx` (`pedidos_idpedidos` ASC) VISIBLE,
  CONSTRAINT `fk_Itens_pedidos_Pedidos1`
    FOREIGN KEY (`pedidos_idpedidos`)
    REFERENCES `eventos`.`pedidos` (`idpedidos`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `eventos`.`ingressos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eventos`.`ingressos` (
  `idingressos` INT NOT NULL,
  `status` ENUM('Válido', 'Validado', 'Cancelado') NULL,
  `dataComp` DATETIME NULL,
  `codigoQr` TEXT NULL,
  `Itens_pedidos_idItens_pedidos` INT NOT NULL,
  PRIMARY KEY (`idingressos`),
  INDEX `fk_ingressos_Itens_pedidos1_idx` (`Itens_pedidos_idItens_pedidos` ASC) VISIBLE,
  CONSTRAINT `fk_ingressos_Itens_pedidos1`
    FOREIGN KEY (`Itens_pedidos_idItens_pedidos`)
    REFERENCES `eventos`.`itens_pedidos` (`iditens_pedidos`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `eventos`.`categoria`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eventos`.`categoria` (
  `idcatEvento` INT NOT NULL,
  `nome` VARCHAR(45) NULL,
  PRIMARY KEY (`idcatEvento`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `eventos`.`eventos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eventos`.`eventos` (
  `ideventos` INT NOT NULL,
  `nome` VARCHAR(45) NULL,
  `descricao` VARCHAR(500) NULL,
  `data_inicio` DATETIME NULL,
  `data_encerramento` DATETIME NULL,
  `tipo_evento` VARCHAR(45) NULL,
  `nome_local` VARCHAR(45) NULL,
  `endereco` VARCHAR(45) NULL,
  `numero_end` INT NULL,
  `cidade` VARCHAR(45) NULL,
  `estado` CHAR(2) NULL,
  `quant_pessoas` INT NULL,
  `status` ENUM('Publicado', 'Encerrado', 'Cancelado') NULL,
  `usuarios_idusuarios` INT NOT NULL,
  `categoria_idcatEvento` INT NOT NULL,
  PRIMARY KEY (`ideventos`, `categoria_idcatEvento`),
  INDEX `fk_eventos_usuarios_idx` (`usuarios_idusuarios` ASC) VISIBLE,
  INDEX `fk_eventos_categoria1_idx` (`categoria_idcatEvento` ASC) VISIBLE,
  CONSTRAINT `fk_eventos_usuarios`
    FOREIGN KEY (`usuarios_idusuarios`)
    REFERENCES `eventos`.`usuarios` (`idusuarios`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_eventos_categoria1`
    FOREIGN KEY (`categoria_idcatEvento`)
    REFERENCES `eventos`.`categoria` (`idcatEvento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `eventos`.`comentarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eventos`.`comentarios` (
  `idcomentario` INT NOT NULL AUTO_INCREMENT,
  `texto` VARCHAR(200) NULL,
  `data` DATETIME NULL,
  `atualizado` DATETIME NULL,
  `comentariopai` VARCHAR(100) NULL,
  `eventos_ideventos` INT NOT NULL,
  `usuarios_idusuarios` INT NOT NULL,
  PRIMARY KEY (`idcomentario`),
  INDEX `fk_comentario_eventos1_idx` (`eventos_ideventos` ASC) VISIBLE,
  INDEX `fk_comentario_usuarios1_idx` (`usuarios_idusuarios` ASC) VISIBLE,
  CONSTRAINT `fk_comentario_eventos1`
    FOREIGN KEY (`eventos_ideventos`)
    REFERENCES `eventos`.`eventos` (`ideventos`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_comentario_usuarios1`
    FOREIGN KEY (`usuarios_idusuarios`)
    REFERENCES `eventos`.`usuarios` (`idusuarios`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `eventos`.`curtidas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eventos`.`curtidas` (
  `idcurtidas` INT NOT NULL,
  `data` DATETIME NULL,
  `eventos_ideventos` INT NOT NULL,
  `usuarios_idusuarios` INT NOT NULL,
  PRIMARY KEY (`idcurtidas`),
  INDEX `fk_like_eventos1_idx` (`eventos_ideventos` ASC) VISIBLE,
  INDEX `fk_like_usuarios1_idx` (`usuarios_idusuarios` ASC) VISIBLE,
  UNIQUE INDEX `idcurtidas_UNIQUE` (`idcurtidas` ASC) VISIBLE,
  CONSTRAINT `fk_like_eventos1`
    FOREIGN KEY (`eventos_ideventos`)
    REFERENCES `eventos`.`eventos` (`ideventos`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_like_usuarios1`
    FOREIGN KEY (`usuarios_idusuarios`)
    REFERENCES `eventos`.`usuarios` (`idusuarios`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `eventos`.`met_pagamentos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eventos`.`met_pagamentos` (
  `idmet_pagamentos]` INT NOT NULL,
  `nome` VARCHAR(45) NULL,
  `descricao` VARCHAR(45) NULL,
  `ativo` TINYINT NULL,
  `taxa_perc` DECIMAL(5,2) NULL,
  `taxa` DECIMAL(10,2) NULL,
  PRIMARY KEY (`idmet_pagamentos]`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `eventos`.`tipo_ingresso`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eventos`.`tipo_ingresso` (
  `idtipo_ingresso` INT NOT NULL,
  `nome` VARCHAR(45) NULL,
  `descricao` VARCHAR(45) NULL,
  `permite_meia` TINYINT NULL,
  `percentual_meia` DECIMAL(5,2) NULL,
  `gratuito` TINYINT(2) NULL,
  `eventos_ideventos` INT NOT NULL,
  `itens_pedidos_iditens_pedidos` INT NOT NULL,
  PRIMARY KEY (`idtipo_ingresso`),
  INDEX `fk_Tipo_Ingresso_eventos1_idx` (`eventos_ideventos` ASC) VISIBLE,
  INDEX `fk_tipo_ingresso_itens_pedidos1_idx` (`itens_pedidos_iditens_pedidos` ASC) VISIBLE,
  CONSTRAINT `fk_Tipo_Ingresso_eventos1`
    FOREIGN KEY (`eventos_ideventos`)
    REFERENCES `eventos`.`eventos` (`ideventos`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_tipo_ingresso_itens_pedidos1`
    FOREIGN KEY (`itens_pedidos_iditens_pedidos`)
    REFERENCES `eventos`.`itens_pedidos` (`iditens_pedidos`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `eventos`.`pagamento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eventos`.`pagamento` (
  `idpagamento` INT NOT NULL,
  `status` ENUM('Aprovado', 'Pendente', 'Reembolsado') NULL,
  `valor` DECIMAL(10,2) NULL,
  `valor_taxa` DECIMAL(10,2) NULL,
  `valor_total` DECIMAL(10,2) NULL,
  `data_pag` DATETIME NULL,
  `pedidos_idpedidos` INT NOT NULL,
  `met_pagamentos_idmet_pagamentos]` INT NOT NULL,
  PRIMARY KEY (`idpagamento`),
  INDEX `fk_Pagamento_Pedidos1_idx` (`pedidos_idpedidos` ASC) VISIBLE,
  INDEX `fk_pagamento_met_pagamentos1_idx` (`met_pagamentos_idmet_pagamentos]` ASC) VISIBLE,
  CONSTRAINT `fk_Pagamento_Pedidos1`
    FOREIGN KEY (`pedidos_idpedidos`)
    REFERENCES `eventos`.`pedidos` (`idpedidos`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_pagamento_met_pagamentos1`
    FOREIGN KEY (`met_pagamentos_idmet_pagamentos]`)
    REFERENCES `eventos`.`met_pagamentos` (`idmet_pagamentos]`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `eventos`.`sub_categoria`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eventos`.`sub_categoria` (
  `idsub_categoria` INT NOT NULL,
  `genero` VARCHAR(45) NULL,
  `categoria_idcatEvento` INT NOT NULL,
  PRIMARY KEY (`idsub_categoria`),
  INDEX `fk_sub_categoria_categoria1_idx` (`categoria_idcatEvento` ASC) VISIBLE,
  CONSTRAINT `fk_sub_categoria_categoria1`
    FOREIGN KEY (`categoria_idcatEvento`)
    REFERENCES `eventos`.`categoria` (`idcatEvento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `eventos`.`lote`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `eventos`.`lote` (
  `idLote` INT NOT NULL,
  `numero_lote` INT NULL,
  `preco` DECIMAL(10,2) NULL,
  `preco_meia` DECIMAL(10,2) NULL,
  `quant_total` INT NULL,
  `quant_vendida` INT NULL,
  `quant_meia_total` INT NULL,
  `quant_meia_vendida` INT NULL,
  `inicio_vendas` DATETIME NULL,
  `fim_vendas` DATETIME NULL,
  `tipo_ingresso_idTipo_Ingresso` INT NOT NULL,
  PRIMARY KEY (`idLote`),
  INDEX `fk_Lote_tipo_ingresso1_idx` (`tipo_ingresso_idTipo_Ingresso` ASC) VISIBLE,
  CONSTRAINT `fk_Lote_tipo_ingresso1`
    FOREIGN KEY (`tipo_ingresso_idTipo_Ingresso`)
    REFERENCES `eventos`.`tipo_ingresso` (`idtipo_ingresso`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
