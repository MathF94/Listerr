<?php

/*
 * listerr - gestionnaire de listes et tâches
 * Copyright (C) 2025 Mathieu Fagot
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

namespace Entity;

/**
 * Classe représentant un utilisateur, qui peut être de type "Admin" ou "User".
 */
class User
{
    const ROLE_ADMIN = 1;
    const ROLE_USER = 2;
    const ROLES = [
        self::ROLE_ADMIN => 'Admin',
        self::ROLE_USER => 'User',
    ];

    public int $id;
    public string $name;
    public string $firstname;
    public string $login;
    public string $email;
    public string $password;
    public string $role;
    public bool $isAdmin;

    /**
     * Définit si l'utilisateur est un administrateur en fonction de la valeur booléenne fournie.
     *
     * @param int $value - Valeur numérique indiquant si l'utilisateur est administrateur.
     * @return User - L'objet utilisateur actuel pour permettre les appels en chaîne.
     */
    public function setIsAdmin(int $value): User
    {
        $this->isAdmin = $value === self::ROLE_ADMIN;
        return $this;
    }

    /**
     * Définit le rôle de l'utilisateur en utilisant le tableau de correspondance ROLES.
     *
     * @param int $value - ID du rôle de l'utilisateur (ROLE_ADMIN ou ROLE_USER).
     * @return User - L'objet utilisateur actuel pour permettre les appels en chaîne.
     */
    public function setRole(int $value): User
    {
        $this->role = self::ROLES[$value];
        return $this;
    }

    /**
     * Initialise les propriétés de l'objet utilisateur à partir d'un tableau associatif de paramètres.
     *
     * @param array $params - Tableau associatif contenant les données utilisateur à peupler.
     * @return void
     */
    public function populate(array $params): void
    {
        $id = !empty($params['user_id']) ? $params['user_id'] : $params['id'];

        $this->id = $id;
        $this->name = $params['name'];
        $this->firstname = $params['firstname'];
        $this->login = $params['login'];
        $this->email = $params['email'];
        $this->password = $params['password'];
        $this->setRole($params['role_id'])
            ->setIsAdmin($params['role_id']);
    }
}
