<?php

namespace Listerr\Model;

use Listerr\Entity\Lister;
use Listerr\Service\Database;

/**
 * La classe Lists gère les opérations liées aux listes dans la base de données.
 */
class Lists extends Database
{
    /**
     * Cette méthode permet de créer une nouvelle liste dans la base de données.
     *
     * @param array $params - Les paramètres de la liste à créer.
     * @param int $userId - L'ID de l'utilisateur associé à la liste.
     * @return bool - Renvoie true en cas de succès, sinon false.
     */
    public function create(array $params, int $userId): bool
    {
        try {
            $req = "INSERT INTO `list` (`type`, `title`, `description`, `user_id`)
            VALUES (:type, :title, :description, :user_id)";
            $params = [
                'type' => $params['typeList'],
                'title' => $params['titleList'],
                'description' => $params['descriptionList'],
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
     * Cette méthode permet de récupérer les détails d'une liste en fonction de son ID.
     *
     * @param int $id - ID de la liste à récupérer.
     * @return Lister|null - L'objet Lister correspondant à la liste ou null si non trouvé.
     */
    public function getOneListById(int $id): ?Lister
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
     * Cette méthode permet de récupérer toutes les listes d'un utilisateur en fonction de l'ID utilisateur.
     *
     * @param int $userId - ID de l'utilisateur pour lequel les listes sont récupérées.
     * @return Lister[] - Un tableau d'objets Lister représentant les listes de l'utilisateur.
     */
    public function AllListsByUser(int $userId): array
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
     * Cette méthode permet de récupérer toutes les listes de tous les utilisateurs.
     *
     * @return Lister[] - Un tableau d'objets Lister représentant toutes les listes de tous les utilisateurs.
     */
    public function AllListsAllUsers(): array
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

    /**
     * Cette méthode permet de mettre à jour les informations d'une liste dans la base de données.
     *
     * @param array $params - Les paramètres mis à jour de la liste.
     * @param int $id - ID de la liste à mettre à jour.
     * @return bool - Renvoie true en cas de succès, sinon false.
     */
    public function updateList(array $params, int $id): bool
    {
        try {
            $req = "UPDATE `list`
                    SET `title` = :title,
                        `type` = :type,
                        `description` = :description,
                        `updated_at` = NOW()
                    WHERE `id` = :id";

            $query = $this->db->prepare($req);
            $params['id'] = $id;

            return $query->execute($params);
        } catch (\Exception $e) {
            echo $e->getMessage();
            return [];
        }
    }

    /**
     * Cette méthode permet de supprimer une liste de la base de données.
     *
     * @param int $id - ID de la liste à supprimer.
     * @return bool - Renvoie true en cas de succès, sinon false.
     */
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
