<?php

namespace Models;

use Services\Database;
use Services\Encryption;
class Users extends Database
{
    /**
     * https://duckduckgo.com/?t=lm&q=uuid&ia=answer
     */
    private const KEY = '4f8005a0-516c-4c93-b829-aad0153e6809';
    private const IV = '-1e15-40c7-adb2-5';

    private $encryption;

    public function __construct()
    {
        parent::__construct();
        $this->encryption = new Encryption();
        $this->encryption->setKey(self::KEY)
                        ->setIv(self::IV);
    }

    public function create(array $params): bool
    {
        try {
            $req = "INSERT INTO `user` (`login`, `password`, `name`, `firstname`, `email`, `role_id`)
            VALUES (:login, :password, :name, :firstname, :email, :role_id)";

            $params = [
                ':login' => $params['login'],
                ':password' => $params['password'],
                ':name' => $params['name'],
                ':firstname' => $params['firstname'],
                ':email' => $params['email'],
                ':role_id' => $params['role_id']
            ];

            $this->executeReq($req, $params);
            return true;

        } catch (\Exception $e) {
            echo $e->getMessage();
            return false;
        }
    }

    public function update(array $parameters, int $id): bool
    {
        $req = "UPDATE `user`
                SET `login`= :login,
                    `name`= :name,
                    `firstname` = :firstname,
                    `email` = :email
                WHERE `id` = :id";
        $query = $this->db->prepare($req);
        $parameters['id'] = $id;
        return $query->execute($parameters);
    }

    public function updatePassword(array $parameters):bool
    {
        $req = "UPDATE `user`
                SET `password`= :password
                WHERE `login` = :login" ;
        $query = $this->db->prepare($req);
        return $query->execute($parameters);
    }

    public function delete(string $login): bool
    {
        $req = "DELETE FROM `user`
                WHERE `login` = :login";
        $query = $this->db->prepare($req);
        return $query->execute(['login' => $login]);
    }

    public function auth(string $login, string $password): array
    {
        try {
            $req = "SELECT `id`,
                        `login`,
                        `password`,
                        `name`,
                        `firstname`,
                        `email`, `role_id`
                    FROM `user`
                    WHERE `login` = :login
                    AND `password` = :password";
            return $this->findOne($req, [
                ':login'    => $login,
                ':password' => $password,
            ]);

        } catch (\Exception $e) {
            echo $e->getMessage();
            return [];
        }
    }

    public function readAll(): array
    {
        try {
            $req = "SELECT `id`, `login`, `password`, `name`, `firstname`, `email`, `role_id`
                    FROM `user`
                    WHERE `id` = :id
                    ORDER BY created_at DESC";
            return $this->findAll($req);

        } catch (\Exception $e) {
            echo $e->getMessage();
            return [];
        }
    }

    public function readOne(string $login): array
    {
        try {
            $req = "SELECT `id`, `login`, `password`, `name`, `firstname`, `email`, `role_id`
                    FROM `user`
                    WHERE `login` = :login
                    ORDER BY created_at DESC";
            return $this->findOne($req, ['login' => $login]);

        } catch (\Exception $e) {
            echo $e->getMessage();
            return [];
        }
    }
}
