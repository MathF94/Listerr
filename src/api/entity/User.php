<?php

namespace Entity;

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

    public function setIsAdmin(bool $value): User
    {
        $this->isAdmin = (int)$value === self::ROLE_ADMIN;
        return $this;
    }

    public function setRole(int $value): User
    {
        $this->role = self::ROLES[$value];
        return $this;
    }

    public function populate(array $params): void
    {
        $this->id = $params['id'];
        $this->name = $params['name'];
        $this->firstname = $params['firstname'];
        $this->login=$params['login'];
        $this->email=$params['email'];
        $this->password=$params['password'];

        $this->setRole($params['role_id'])
            ->setIsAdmin($params['role_id']);
    }
}
