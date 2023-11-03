--
-- Déchargement des données de la table `role`
--

INSERT INTO `role` (`id`, `name`) VALUES
(1, 'Admin'),
(2, 'User');

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`login`, `password`, `name`, `firstname`, `email`, `role_id`, `created_at`, `updated_at`) VALUES
('Admin', '1npbTVOKPJolD6K987neETCT62+wxr9gaD6AZ2HU8OA=', 'ADMIN', 'Admin', 'admin@hotmail.io', 1, '2023-10-02 12:26:56', '2023-10-02 12:26:56');

