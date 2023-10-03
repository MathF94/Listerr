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
        $this->isAdmin = $value;
        return $this;
    }

    public function setId(int $value): User
    {
        $this->id = $value;
        return $this;
    }

    public function setName(string $value): User
    {
        $this->name = $value;
        return $this;
    }

    public function setFirstname(string $value): User
    {
        $this->firstname = $value;
        return $this;
    }

    public function setLogin(string $value): User
    {
        $this->login = $value;
        return $this;
    }

    public function setEmail(string $value): User
    {
        $this->email = $value;
        return $this;
    }

    public function setPassword(string $value): User
    {
        $this->password = $value;
        return $this;
    }

    public function setRole(int $value): User
    {
        $this->role = self::ROLES[$value];
        return $this;
    }

    public function populate(array $params): void
    {
        $this->setId($params['id'])
            ->setName($params['name'])
            ->setFirstname($params['firstname'])
            ->setLogin($params['login'])
            ->setEmail($params['email'])
            ->setPassword($params['password'])
            ->setRole($params['role_id'])
            ->setIsAdmin((int)$params['role_id'] === self::ROLE_ADMIN);
    }
}
