<?php

namespace Entity;

/**
 * Classe représentant un utilisateur, qui peut être de type "Admin" ou "User".
 */
class User
{
    const ROLE_ADMIN = 1;
    const ROLE_USER = 2;
    const ROLES = [
        self::ROLE_ADMIN => 'admin',
        self::ROLE_USER => 'user',
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
     * @param bool $value - Valeur booléenne indiquant si l'utilisateur est administrateur.
     * @return User - L'objet utilisateur actuel pour permettre les appels en chaîne.
     */
    public function setIsAdmin(bool $value): User
    {
        $this->isAdmin = (int)$value === self::ROLE_ADMIN;
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
<<<<<<< Updated upstream
        $this->id = $params['id'];
=======
        $id = !empty($params['user_id']) ? $params['user_id'] : $params['id'];

        $this->id = $id;
>>>>>>> Stashed changes
        $this->name = $params['name'];
        $this->firstname = $params['firstname'];
        $this->login=$params['login'];
        $this->email=$params['email'];
        $this->password=$params['password'];

        $this->setRole($params['role_id'])
            ->setIsAdmin($params['role_id']);
    }
}
