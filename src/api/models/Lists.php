<?php

namespace Models;

use Entity\Lister;
use Services\Database;

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

    // toutes les listes pour un utilisateur
    public function listByUser(int $userId): array
    {
        try {
            $req = "SELECT `l`.`id` AS `list_id`,
                            `l`.`type`,
                            `l`.`title`,
                            `l`.`description`,
                            `u`.`id` AS `user_id`,
                            `u`.`name`,
                            `u`.`firstname`,
                            `u`.`login`,
                            `u`.`email`,
                            `u`.`role_id`,
                            '' AS `password`,
                            `l`.`created_at`,
                            `l`.`updated_at`
                    FROM `list` `l`
                    INNER JOIN `user` `u` ON `u`.`id` = `l`.`user_id`
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

    // retourne une liste en fonction de son id
    public function readOne(string $id): ?Lister
    {
        try {
            $req = "SELECT `l`.`id` AS `list_id`,
                            `l`.`type`,
                            `l`.`title`,
                            `l`.`description`,
                            `u`.`id` AS `user_id`,
                            `u`.`name`,
                            `u`.`firstname`,
                            `u`.`login`,
                            `u`.`email`,
                            `u`.`role_id`,
                            '' AS `password`,
                            `l`.`created_at`,
                            `l`.`updated_at`
                    FROM `list` `l`
                    INNER JOIN `user` `u` ON `u`.`id` = `l`.`user_id`
                    WHERE `id` = :id
                    ORDER BY created_at DESC";
            $result = $this->findOne($req, ['id' => $id]);

            $lister = new Lister();
            $lister->populate($result);
            return $lister;
        } catch (\Exception $e) {
            echo $e->getMessage();
            return null;
        }
    }

    /**
     * [ADMIN] retourne toutes les listes de tous les utilisateurs avec login
     */
    public function readAllByUser(): array
    {
        try {
            $req = "SELECT `l`.`id` AS `list_id`,
                            `l`.`type`,
                            `l`.`title`,
                            `l`.`description`,
                            `u`.`id` AS `user_id`,
                            `u`.`name`,
                            `u`.`firstname`,
                            `u`.`login`,
                            `u`.`email`,
                            `u`.`role_id`,
                            '' AS `password`,
                            `l`.`created_at`,
                            `l`.`updated_at`
                    FROM `list` `l`
                    INNER JOIN `user` `u` ON `u`.`id` = `l`.`user_id`
                    ORDER BY `l`.`updated_at` ASC";
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
