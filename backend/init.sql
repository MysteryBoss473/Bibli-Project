-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema bibli-project
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema bibli-project
-- -----------------------------------------------------
CREATE DATABASE IF NOT EXISTS `bibli-project` DEFAULT CHARACTER SET utf8 ;
USE `bibli-project` ;

-- -----------------------------------------------------
-- Table `bibli-project`.`Utilisateur`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bibli-project`.`Utilisateur` (
  `idUtilisateur` INT NOT NULL,
  `Role` VARCHAR(45) NOT NULL,
  `Nom` VARCHAR(45) NOT NULL,
  `Prenoms` VARCHAR(65) NOT NULL,
  `Email` VARCHAR(45) NOT NULL,
  `MotDePasse` VARCHAR(256) NOT NULL,
  PRIMARY KEY (`idUtilisateur`),
  UNIQUE INDEX `Email_UNIQUE` (`Email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bibli-project`.`Livre`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bibli-project`.`Livre` (
  `ISBN` VARCHAR(45) NOT NULL,
  `Titre` VARCHAR(45) NOT NULL,
  `Auteur` VARCHAR(100) NOT NULL,
  `Genre` VARCHAR(45) NOT NULL,
  `DatePublication` DATE NOT NULL,
  `Exemplaires` INT NOT NULL,
  PRIMARY KEY (`ISBN`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bibli-project`.`Emprunt`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bibli-project`.`Emprunt` (
  `idEmprunt` INT NOT NULL AUTO_INCREMENT,
  `Statut` VARCHAR(45) NOT NULL,
  `DateEmprunt` DATE NOT NULL,
  `LimiteRetour` DATE NOT NULL,
  `ISBN` VARCHAR(45) NOT NULL,
  `IdUtilisateur` INT NOT NULL,
  PRIMARY KEY (`idEmprunt`),
  INDEX `fk_Emprunt_Livre_idx` (`ISBN` ASC) VISIBLE,
  INDEX `fk_Emprunt_Utilisateur1_idx` (`IdUtilisateur` ASC) VISIBLE,
  CONSTRAINT `fk_Emprunt_Livre`
    FOREIGN KEY (`ISBN`)
    REFERENCES `bibli-project`.`Livre` (`ISBN`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Emprunt_Utilisateur1`
    FOREIGN KEY (`IdUtilisateur`)
    REFERENCES `bibli-project`.`Utilisateur` (`idUtilisateur`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bibli-project`.`Notation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bibli-project`.`Notation` (
  `Note` INT NULL,
  `ISBN` VARCHAR(45) NOT NULL,
  `idUtilisateur` INT NOT NULL,
  INDEX `fk_Notation_Livre1_idx` (`ISBN` ASC) VISIBLE,
  PRIMARY KEY (`ISBN`, `idUtilisateur`),
  INDEX `fk_Notation_Utilisateur1_idx` (`idUtilisateur` ASC) VISIBLE,
  CONSTRAINT `fk_Notation_Livre1`
    FOREIGN KEY (`ISBN`)
    REFERENCES `bibli-project`.`Livre` (`ISBN`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Notation_Utilisateur1`
    FOREIGN KEY (`idUtilisateur`)
    REFERENCES `bibli-project`.`Utilisateur` (`idUtilisateur`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bibli-project`.`Commentaire`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bibli-project`.`Commentaire` (
  `idCommentaire` INT NOT NULL AUTO_INCREMENT,
  `Contenu` MEDIUMTEXT NULL,
  `ISBN` VARCHAR(45) NOT NULL,
  `idUtilisateur` INT NOT NULL,
  PRIMARY KEY (`idCommentaire`),
  INDEX `fk_Commentaires_Livre1_idx` (`ISBN` ASC) VISIBLE,
  INDEX `fk_Commentaires_Utilisateur1_idx` (`idUtilisateur` ASC) VISIBLE,
  CONSTRAINT `fk_Commentaires_Livre1`
    FOREIGN KEY (`ISBN`)
    REFERENCES `bibli-project`.`Livre` (`ISBN`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Commentaires_Utilisateur1`
    FOREIGN KEY (`idUtilisateur`)
    REFERENCES `bibli-project`.`Utilisateur` (`idUtilisateur`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


CREATE TABLE `access_token` (
  `access_token_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `idUtilisateur` int DEFAULT NULL,
  `access_token` text,
  `ip_address` varchar(15) DEFAULT NULL,
  `DateMAJ` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  constraint fk_1 foreign key (`idUtilisateur`) references `utilisateur`(`idUtilisateur`)
);