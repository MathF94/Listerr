--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `login`, `password`, `name`, `firstname`, `email`, `role_id`, `created_at`, `updated_at`) VALUES
(299, 'Admin', '8/FRO8lr1s7tYXRieWT2EQ==', 'FAGOT', 'Mathieu', 'mathieu@hotmail.io', 1, '2023-10-02 12:26:56', '2023-10-02 12:26:56'),
(300, 'Julien', '8/FRO8lr1s7tYXRieWT2EQ==', 'FAGOT', 'Julien', 'julien@hotmail.io', 2, '2023-10-02 12:28:26', '2023-10-02 12:28:26'),
(301, 'Eric', '8/FRO8lr1s7tYXRieWT2EQ==', 'FAGOT', 'Eric', 'eric@hotmail.io', 2, '2023-10-02 12:28:42', '2023-10-02 12:28:42'),
(304, 'Math_user', '8/FRO8lr1s7tYXRieWT2EQ==', 'FAGOT', 'Mathieu', 'mathieu@gmail.io', 2, '2023-10-02 17:13:07', '2023-10-02 17:13:07'),
(305, 'Axel', '1QRbcbsRDlwwk1WmeXhnnA==', 'FAGOT', 'Axel', 'axel@hotmail.io', 2, '2023-10-05 10:09:07', '2023-10-05 10:09:07'),
(320, 'Sasha', '8/FRO8lr1s7tYXRieWT2EQ==', 'FAGOT', 'Sasha', 'sasha@hotmail.fr', 2, '2023-10-10 17:07:07', '2023-10-10 17:07:07'),
(321, 'Freddie', '8/FRO8lr1s7tYXRieWT2EQ==', 'FAGOT', 'Frédérique', 'frfada@h.fr', 2, '2023-10-11 15:18:28', '2023-10-11 15:18:28'),
(322, 'Ana', '1QRbcbsRDlwwk1WmeXhnnA==', 'PENOT', 'Anaïs', 'ana@hotmail.io', 2, '2023-10-13 14:39:00', '2023-10-13 14:39:00');

--
-- Déchargement des données de la table `role`
--

INSERT INTO `role` (`id`, `name`) VALUES
(1, 'Admin'),
(2, 'User');

--
-- Déchargement des données de la table `list`
--

INSERT INTO `list` (`id`, `type`, `title`, `description`, `user_id`, `created_at`, `updated_at`) VALUES
(35, 'WishList', 'Liste de cadeaux - Axel', 'Noël 2023', 304, '2023-10-13 14:27:36', '2023-10-13 14:27:36'),
(36, 'WishList', 'Liste de cadeaux - Sasha', 'Noël 2023', 322, '2023-10-13 14:27:48', '2023-10-13 14:27:48'),
(38, 'WishList', 'Sortie en amoureux', 'Lieux / Villes à visiter', 304, '2023-10-13 14:28:16', '2023-10-13 14:28:16'),
(39, 'TodoList', 'Développeur Fullstack - Recherche emploi 2024', 'Mise à jour de CV', 304, '2023-10-13 14:29:59', '2023-10-13 14:29:59'),
(40, 'WishList', 'Liste de cadeaux - Mathieu', 'Noël 2023', 304, '2023-10-13 14:37:05', '2023-10-13 14:37:05'),
(41, 'WishList', 'Liste de cadeaux - Mathieu', 'Anniversaire 37 ans !', 304, '2023-10-13 14:37:39', '2023-10-13 14:37:39'),
(43, 'WishList', 'Liste de cadeaux - Anaïs', 'Anniversaire 35 ans !', 322, '2023-10-13 14:39:37', '2023-10-13 14:39:37'),
(44, 'TodoList', 'Evolution professionnelle Anaïs 2024', 'Passer infirmière référente / IPA', 322, '2023-10-13 14:39:54', '2023-10-13 14:39:54'),
(45, 'WishList', 'Sortie en amoureux', 'Restaurant / Activités', 322, '2023-10-13 14:40:19', '2023-10-13 14:40:19'),
(46, 'TodoList', 'Développeur Fullstack - Recherche emploi 2024 	', 'Rédiger des lettres de motivation', 304, '2023-10-13 15:46:00', '2023-10-13 15:46:00'),
(48, 'TodoList', 'CRUD Admin', 'Faire l\'affichage d\'une liste par utilisateur avec bouton update et delete', 299, '2023-10-18 22:05:45', '2023-10-18 22:05:45'),
(49, 'TodoList', 'CRUD Admin', 'Faire l\'update d\'un utilisateur', 299, '2023-10-18 22:08:39', '2023-10-18 22:08:39'),
(50, 'TodoList', 'CRUD Admin', 'Faire le delete d\'un utilisateur', 299, '2023-10-18 22:08:55', '2023-10-18 22:08:55'),
(51, 'TodoList', 'CRUD Admin', 'Faire l\'affichage de toutes les listes par utilisateur avec bouton update et delete par utilisateur', 299, '2023-10-18 22:10:13', '2023-10-18 22:10:13');
