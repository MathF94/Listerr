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

    /**
     * retourne une liste d'un utilisateur en fonction de l'id de la liste sélectionnée
     */
    public function oneListById(int $id): ?Lister
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
                    WHERE `l`.`id` = :id";

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
     * Toutes les listes d'un utilisateur
     */
    public function listsOneUser(int $userId): array
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

    /**
     * Toutes les listes de tous les utilisateurs avec login
     */
    public function listsByUsers(): array
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

    public function update(array $params, int $id): bool
    {
        $req = "UPDATE `list`
                SET `title`= :title,
                    `description`= :description,
                WHERE `id` = :id";
        $query = $this->db->prepare($req);
        $parameters['id'] = $id;
        return $query->execute($parameters);
    }

    public function deleteList(int $id): bool
    {
        try {
            $req = "DELETE FROM `list`
                    WHERE `id` = :id";

            $query = $this->db->prepare($req);
            return $query->execute(['id' => $id]);

        } catch (\Exception $e) {
            echo $e->getMessage();
            return [];
        }
    }
}
