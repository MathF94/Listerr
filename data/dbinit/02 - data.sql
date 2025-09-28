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

