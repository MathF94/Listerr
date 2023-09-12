<?php

namespace Models;

use Services\Database;

Class Users extends Database 
{
    // faire le crud avec fonction read, update, delete, create
    // fonction avec code SQL pour le select insert etc...
    
    public function create(array $params): bool
    {
        try {
            $sql = "INSERT INTO `user` (`login`, `password`, `name`, `email`, `role_id`) 
                VALUES ('". $params['login'] ."',
                '". $params['password'] ."',
                '". $params['name'] ."',
                '". $params['email'] ."',
                '". $params['role_id'] ."')";
                $this->executeReq($sql);
                return true;

        } catch (\Exception $e) {
            echo $e->getMessage();
            return false;
        }        
    }

    public function auth(string $login, string $password): array
    {
        try {
            $sql = "SELECT `login`, `password`, `name`, `email`, `role_id`
            WHERE login = $login, password = $password";
            return $this->executeReq($sql);

        } catch (\Exception $e) {
            echo $e->getMessage();
            return [];
        }
    }
}