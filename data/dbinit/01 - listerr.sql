/*
listerr - gestionnaire de listes et tâches
Copyright (C) 2025 Mathieu Fagot

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

-- phpMyAdmin SQL Dump

-- version 5.2.0

-- https://www.phpmyadmin.net/

--

-- Hôte : 127.0.0.1:3306

-- Généré le : mer. 18 oct. 2023 à 20:40

-- Version du serveur : 8.0.31

-- Version de PHP : 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

START TRANSACTION;

SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */

;

/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */

;

/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */

;

/*!40101 SET NAMES utf8mb4 */

;

--

-- Base de données : `listerr`

--

-- --------------------------------------------------------

--

-- Structure de la table `user`

--

CREATE TABLE
    IF NOT EXISTS `user` (
        `id` int NOT NULL AUTO_INCREMENT,
        `login` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
        `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
        `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
        `firstname` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
        `email` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
        `role_id` int NOT NULL,
        `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        UNIQUE KEY `login` (`login`),
        UNIQUE KEY `email` (`email`),
        FOREIGN KEY `role_id` REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE = InnoDB AUTO_INCREMENT = 323 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------

--

-- Structure de la table `role`

--

CREATE TABLE
    IF NOT EXISTS `role` (
        `id` int NOT NULL AUTO_INCREMENT,
        `name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
        PRIMARY KEY (`id`)
    ) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------

--

-- Structure de la table `list`

--

CREATE TABLE
    IF NOT EXISTS `list` (
        `id` int NOT NULL AUTO_INCREMENT,
        `type` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
        `title` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
        `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
        `user_id` int NOT NULL,
        `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        FOREIGN KEY `user_id` REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE = InnoDB AUTO_INCREMENT = 52 DEFAULT CHARSET = utf8mb3 COMMENT = 'utf8_general_ci';

-- --------------------------------------------------------

--

-- Structure de la table `card`

--

CREATE TABLE
    IF NOT EXISTS `card` (
        `id` int NOT NULL AUTO_INCREMENT,
        `title` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
        `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
        `priority` int NOT NULL,
        `checked` tinyint NOT NULL DEFAULT '0',
        `list_id` int NOT NULL,
        `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        FOREIGN KEY `list_id` REFERENCES `list` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3 COMMENT = 'utf8_general_ci';

-- --------------------------------------------------------

--

-- Structure de la table `reservation`

--

CREATE TABLE
    IF NOT EXISTS `reservation` (
        `id` int NOT NULL AUTO_INCREMENT,
        `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
        `email` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
        `list_id` int NOT NULL,
        `card_id` int NOT NULL,
        `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        FOREIGN KEY `list_id` REFERENCES `list` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY `card_id` REFERENCES `card` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    ) ENGINE=InnoDB AUTO_INCREMENT=205 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



COMMIT;
