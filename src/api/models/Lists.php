<?php

namespace Models;

use Entity\Lister;
use Services\Database;
use Services\Encryption;

class Lists extends Database
{
    public function create(array $params, int $userId): bool
    {
        try {
            $req = "INSERT INTO `list` (`type`, `title`, `description`, `user_id`)
            VALUES (:type, :title, :description, :user_id)";

            $params = [
                'type' => $params['type'],
                'title' => $params['title'],
                'description' => $params['description'],
                'user_id' => $userId
            ];

            $this->executeReq($req, $params);
            return true;
        } catch (\Exception $e) {
            echo $e->getMessage();
            return false;
        }
    }

    public function readOne(string $id): ?Lister
    {
        try {
            $req = "SELECT `id`,
                            `type`,
                            `title`,
                            `description`,
                            `user_id`
                    FROM `list`
                    WHERE `user_id` = :user_id
                    ORDER BY created_at DESC";
            $result = $this->findOne($req, ['user_id' => $id]);

            $lister = new Lister();
            $lister->populate($result);
            return $lister;
        } catch (\Exception $e) {
            echo $e->getMessage();
            return null;
        }
    }

    public function listByUser(int $userId, string $type): array
    {
        try {
            $req = "SELECT `id`,
                            `type`,
                            `title`,
                            `description`,
                            `user_id`
                    FROM `list`
                    WHERE `user_id` = :user_id
                    ORDER BY created_at ASC";

            $results = $this->findAll($req, [
                "user_id" => $userId,
            ]);
            $listsArray = [];

            foreach ($results as $result) {
                $lister = new Lister();
                $lister->populate($result);
                $listsArray[] = $lister;
            }
            return $listsArray;
        } catch (\Exception $e) {
            echo $e->getMessage();
            return [];
        }
    }

    public function readAll(): array
    {
        try {
            $req = "SELECT `id`,
                            `type`,
                            `title`,
                            `description`,
                            `user_id`
                    FROM `list`
                    ORDER BY created_at ASC";

            $results = $this->findAll($req);
            $listsArray = [];

            foreach ($results as $result) {
                $lister = new Lister();
                $lister->populate($result);
                $listsArray[] = $lister;
            }
            return $listsArray;
        } catch (\Exception $e) {
            echo $e->getMessage();
            return [];
        }
    }

    public function readAllByUser(): array
    {
        try {
            $req = "SELECT `l.id`,
                            `l.type`,
                            `l.title`,
                            `l.description`,
                            `u.login`,
                            `l.created_at`,
                            `l.updated_at`
                    FROM list l
                    INNER JOIN `user` u ON `u.id` = `l.user_id`
                    ORDER BY `l.updated_at` ASC";
            $results = $this->findAll($req);
            
            $listsArray = [];

            foreach ($results as $result) {
                $lister = new Lister();
                $lister->populate($result);
                $listsArray[] = $lister;
            }
            return $listsArray;
        } catch (\Exception $e) {
            echo $e->getMessage();
            return [];
        }
    }

    public function update(array $parameters, int $id): bool
    {
        $req = "UPDATE `list`
                SET `title`= :title,
                    `description`= :description,
                WHERE `id` = :id";
        $query = $this->db->prepare($req);
        $parameters['id'] = $id;
        return $query->execute($parameters);
    }

    public function delete(string $userId): bool
    {
        $req = "DELETE FROM `list`
                WHERE `user_id` = :user_id";
        $query = $this->db->prepare($req);
        return $query->execute(['user_id' => $userId]);
    }
}
