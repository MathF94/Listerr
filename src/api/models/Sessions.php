<?php

namespace Models;

use Services\Database;

class Sessions extends Database
{
    public function create(): mixed
    {
        try {
            $sql = "INSERT INTO `session_user` (`login`, `id_session`) 
                    VALUES ('". $_SESSION['login'] ."', 
                            '" . $_SESSION['id_session'] . "')";                        
            $this->executeReq($sql);
                return true;

        } catch (\Exception $e) {
            echo $e->getMessage();
            return false;
        }
    }

    public function readAll()
    {
        try {
            $req = "SELECT `id`, `login`, `id_session`
                    FROM `session_user`
                    ORDER BY `created_at` 
                    DESC"; 
            return $this->findAll($req);

        } catch (\Exception $e) {
            echo $e->getMessage();
            return false;
        }
    }
    
    public function readBy(array $params)
    {
        try {
            $req = "SELECT `id`, `login`, `id_session`
                    FROM `session_user`";

            $hasWhere = true;
            
            foreach($params as $key => $value){
                $andWhere = $hasWhere?'WHERE':'AND';
                $req.= "$andWhere" . ' ' . $key . ' ' . '= $value' . ' ';
                $hasWhere = true;
            }
            $params = [];
            
            return $this->findOne($req, $params);

        } catch (\Exception $e) {
            echo $e->getMessage();
            return false;
        }
    }

    public function readOne(int $id)
    {
        try {
            $req = "SELECT `id`, `login`, `id_session` 
                    FROM `session_user`
                    WHERE `id` = :id 
                    ORDER BY `created_at`
                    DESC"; 

            return $this->findOne($req, [':id' => $id]);
            
        } catch (\Exception $e) {
            echo $e->getMessage();
            return false;
        }
    }

    public function update()
    {
        try {
            $sql = "UPDATE `session_user` 
                    SET `login` = :login, id_session` = :id_session
                    WHERE `id` = :id" ;
            return $this->executeReq($sql);

        } catch (\Exception $e) {
            echo $e->getMessage();
            return false;
        }
    }

    public function delete(string $login)
    {
        try {
            $sql = "DELETE FROM `session_user` 
                    WHERE `login` = :login";
            return $this->executeReq($sql, [
                ':login' => $login
                ]);

        } catch (\Exception $e) {
            echo $e->getMessage();
            return false;
        }
    }
}
