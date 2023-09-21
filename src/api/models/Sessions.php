<?php

namespace Models;

use Services\Database;

class Sessions extends Database
{
    public function create(string $login, string $tokenUser, mixed $expiredAtFormatted): mixed
    {
        try {
            $sql = "INSERT INTO `session_user` (`login`, `token_user`, `expired_at`)
                    VALUES ('{$login}',
                            '{$tokenUser}',
                            '{$expiredAtFormatted}')";
            $this->executeReq($sql);
                return true;

        } catch (\Exception $e) {
            echo $e->getMessage();
            return false;
        }
    }

    public function readAll(): array
    {
        try {
            $req = "SELECT `id`, `login`, `token_user`, `expired_at`
                    FROM `session_user`
                    ORDER BY `created_at`
                    DESC";
            return $this->findAll($req);

        } catch (\Exception $e) {
            echo $e->getMessage();
            return false;
        }
    }

    public function readBy(array $params): array
    {
        try {
            $req = "SELECT `id`, `login`, `token_user`, `expired_at`
                    FROM `session_user` ";

            $hasWhere = false;

            foreach(array_keys($params) as $key){
                $andWhere = $hasWhere?'AND':'WHERE';
                $req.= "{$andWhere} {$key} = :{$key} ";
                $hasWhere = true;
            }

            return $this->findOne($req, $params);

        } catch (\Exception $e) {
            echo $e->getMessage();
            return false;
        }
    }

    public function readOne(string $tokenUser): array
    {
        try {
            $req = "SELECT `id`, `login`, `token_user`,`expired_at`
                    FROM `session_user`
                    WHERE `token_user` = :tokenUser
                    ORDER BY `created_at`
                    DESC";

            return $this->findOne($req, [':tokenUser' => $tokenUser]);

        } catch (\Exception $e) {
            echo $e->getMessage();
            return false;
        }
    }

    public function update(): mixed
    {
        try {
            $sql = "UPDATE `session_user`
                    SET `login` = :login, token_user` = :token_user, `expired_at` = :expired_at
                    WHERE `id` = :id" ;
            return $this->executeReq($sql);

        } catch (\Exception $e) {
            echo $e->getMessage();
            return false;
        }
    }

    public function delete(string $tokenUser): mixed
    {
        try {
            $sql = "DELETE FROM `session_user`
                    WHERE `token_user` = :token_user";
            return $this->executeReq($sql, [
                ':token_user' => $tokenUser
                ]);

        } catch (\Exception $e) {
            echo $e->getMessage();
            return false;
        }
    }
}
