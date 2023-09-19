<?php

namespace Models;

use Services\Database;
Class Users extends Database 
{
    // faire le crud avec fonction read, update, delete, create
    // fonction avec code SQL pour le select insert etc...
    private $salt;

    /**
     * this function allows to bring the Database's construct and to add an argument salt (unique id) used to the password crypt($string, $salt)
     * https://www.php.net/manual/fr/function.crypt.php
     * https://duckduckgo.com/?t=lm&q=uuid&ia=answer
     */
    public function __construct() 
    {
        parent::__construct();
        $this->salt = hash('sha512', '29fe0e32-526e-11ee-b6e4-63b796ba64f4'); 
    }

    public function create(array $params): bool
    {
        try {
            $password = crypt($params['password'], $this->salt);
            $req = "INSERT INTO `user` (`login`, `password`, `name`, `firstname`, `email`, `role_id`) 
                    VALUES ('{$params['login']}',
                            '{$password}',
                            '{$params['name']}',
                            '{$params['firstname']}',
                            '{$params['email']}',
                            '{$params['role_id']}')";
                $this->executeReq($req);
                return true;

        } catch (\Exception $e) {
            echo $e->getMessage();
            return false;
        }        
    }

    public function auth(string $login, string $password): array
    {
        try {
            $password = crypt($password, $this->salt);
            
            $req = "SELECT `id`, `login`, `password`, `name`, `firstname`, `email`, `role_id`
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
                    ORDER BY created_at 
                    DESC";
            return $this->findAll($req);
            
        } catch (\Exception $e) {
            echo $e->getMessage();
            return [];
        }
    }
    
    public function readOne(int $id): array
    {
        try {
            $req = "SELECT `id`, `login`, `password`, `name`, `firstname`, `email`, `role_id`
                    FROM `user` 
                    WHERE `id` = :id 
                    ORDER BY created_at 
                    DESC";
            return $this->findOne($req, ['id' => $id]);
            
        } catch (\Exception $e) {
            echo $e->getMessage();
            return [];
        }
    }
}
