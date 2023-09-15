-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : jeu. 14 sep. 2023 à 14:20
-- Version du serveur : 8.0.31
-- Version de PHP : 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `listerr`
--

-- --------------------------------------------------------

--
-- Structure de la table `card`
--

DROP TABLE IF EXISTS `card`;
CREATE TABLE IF NOT EXISTS `card` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `priority` int NOT NULL,
  `checked` tinyint NOT NULL DEFAULT '0',
  `list_id` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_card_list` (`list_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='utf8_general_ci';

-- --------------------------------------------------------

--
-- Structure de la table `list`
--

DROP TABLE IF EXISTS `list`;
CREATE TABLE IF NOT EXISTS `list` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `user_id` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_list_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='utf8_general_ci';

-- --------------------------------------------------------

--
-- Structure de la table `role`
--

DROP TABLE IF EXISTS `role`;
CREATE TABLE IF NOT EXISTS `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `role`
--

INSERT INTO `role` (`id`, `name`) VALUES
(1, 'User'),
(2, 'Admin');

-- --------------------------------------------------------

--
-- Structure de la table `session_user`
--

DROP TABLE IF EXISTS `session_user`;
CREATE TABLE IF NOT EXISTS `session_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `login` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `id_session` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expired_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `login` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `role_id` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `login` (`login`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id_idx` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `login`, `password`, `name`, `email`, `role_id`, `created_at`, `updated_at`) VALUES
(4, 'Math', 'truc', 'FAGOT', 'mathieu_fagot@hotmail.fr', 1, '2023-09-12 11:02:02', '2023-09-12 11:02:02'),
(5, 'Math94', '$2y$10$J5y8in2iSrO4yZGHe9b41OUP6Hu/7vdj3TIEwpY/JXfiqwYsv6AaC', 'FAGOT', 'mathieufagot@hotmail.fr', 1, '2023-09-12 14:33:38', '2023-09-12 14:33:38'),
(6, '  ', '$2y$10$.mKL/Vhc67iqpyPoUlpYP.AjJY819VoMYaDl1vdO16HnL6v0NdrkK', '  ', '    ', 1, '2023-09-12 15:55:00', '2023-09-12 15:55:00'),
(8, '<script>document.location.href=\"https://www.youtube.com/watch?v=17vFHKwq8B8\";</script>', '$2y$10$qnBIrs0y0I72.kgzlKioReHTHkrmygbnVS1hUHKb6KRg.8nw7drZe', 'FAGOT  ', 'fagot@hotmail.fr    ', 1, '2023-09-12 16:02:28', '2023-09-12 16:02:28'),
(24, 'Math_94', '$2y$10$MvWZBvAiQrlj0F5kRRzr1.d0TMT41E02/RQVxkmcDLd5cTnwjPxKm', 'FAGOT', 'fagotmathieu@gmail.com', 1, '2023-09-13 14:25:58', '2023-09-13 14:25:58'),
(26, 'Math_94500', '$2y$10$ZGJpek0YXCyHHaibzcAHZOe.2YDcc/wIWwrEXVyOuvrNC4Lz31ODq', 'Mathieu', 'math@hot.com', 1, '2023-09-13 15:25:39', '2023-09-13 15:25:39'),
(27, 'Math_94501', '$2y$10$77z.yryBHjRgk9bmgH5lTeOichWrKQW4Njm/KUtd/oJBB34/Lchfi', 'Mathieu', 'math@hotmail.com', 1, '2023-09-13 17:00:54', '2023-09-13 17:00:54'),
(28, 'Math_94502', '$2y$10$MFivFoxa.whL.33yCVeStu2G6.w5DSLlzj0NbpjLY0Ch.FJr7NKJu', 'Mathieu', 'mat@hotmail.com', 1, '2023-09-13 21:29:33', '2023-09-13 21:29:33'),
(29, 'Math_94503', 'eU9ST1NISUtVODcrKys=', 'Mathieu', 'matt@hotmail.com', 1, '2023-09-13 21:42:18', '2023-09-13 21:42:18'),
(30, 'Math_94505', '87eMKwAnDvZw2', 'Mathieu', 'matth@hotmail.io', 1, '2023-09-13 22:01:32', '2023-09-13 22:01:32'),
(31, 'Math_94506', '87eMKwAnDvZw2', 'Mathieu', 'matfag@hotmail.io', 1, '2023-09-13 22:32:51', '2023-09-13 22:32:51'),
(33, 'Math_94507', '87eMKwAnDvZw2', 'Mathieu', 'mathfag@hotmail.io', 1, '2023-09-13 22:33:44', '2023-09-13 22:33:44');

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `card`
--
ALTER TABLE `card`
  ADD CONSTRAINT `fk_card_list` FOREIGN KEY (`list_id`) REFERENCES `list` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `list`
--
ALTER TABLE `list`
  ADD CONSTRAINT `fk_list_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
