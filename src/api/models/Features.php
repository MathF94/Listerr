<?php

namespace Models;

use Entity\Feature;
use Services\Database;

/**
 * La classe Lists gère les opérations liées aux listes dans la base de données.
 */
class Features extends Database
{
    /**
     * Cette méthode permet de créer une nouvelle liste dans la base de données.
     *
     * @param array $params - Les paramètres de la liste à créer.
     * @param int $userId - L'ID de l'utilisateur associé à la liste.
     * @return bool - Renvoie true en cas de succès, sinon false.
     */
    public function createFeature(array $params, int $userId): bool
    {
        try {
            $req = "INSERT INTO `feature` (`type`, `title`, `description`, `status`, `user_id`)
            VALUES (:type, :title, :description, :status, :user_id)";
            $params = [
                'type' => $params['typeFeature'],
                'title' => $params['titleFeature'],
                'description' => $params['descriptionFeature'],
                'status' => $params['statusFeature'],
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
     * Cette méthode permet de récupérer les détails d'une feature en fonction de son ID.
     *
     * @param int $id - ID de la feature à récupérer.
     * @return Feature|null - L'objet feature correspondant à la feature ou null si non trouvé.
     */
    public function getOneFeatureById(int $id): ?Feature
    {
        try {
                $req = "SELECT `f`.`id` AS `feature_id`,
                            `f`.`type`,
                            `f`.`title`,
                            `f`.`description`,
                            `f`.`status`,
                            `u`.`id` AS `user_id`,
                            `u`.`name`,
                            `u`.`firstname`,
                            `u`.`login`,
                            `u`.`email`,
                            `u`.`role_id`,
                            '' AS `password`,
                            `f`.`created_at`,
                            `f`.`updated_at`
                    FROM `feature` `f`
                    INNER JOIN `user` `u` ON `u`.`id` = `f`.`user_id`
                    WHERE `f`.`id` = :id";

            $result = $this->findOne($req, ['id' => $id]);
            $feature = new Feature();

            $feature->populate($result);
            return $feature;
        } catch (\Exception $e) {
            echo $e->getMessage();
            return null;
        }
    }

    /**
     * Cette méthode permet de récupérer les informations de toutes les évolutions.
     *
     * @return Feature[] - Un tableau d'objets Feature représentant toutes les évolutions.
     */
    public function readAllFeaturesAllUsers(): array
    {
        try {
            $req = "SELECT `f`.`id` AS `feature_id`,
                            `f`.`type`,
                            `f`.`title`,
                            `f`.`description`,
                            `f`.`status`,
                            `u`.`id` AS `user_id`,
                            `u`.`name`,
                            `u`.`firstname`,
                            `u`.`login`,
                            `u`.`email`,
                            `u`.`role_id`,
                            '' AS `password`,
                            `f`.`created_at`,
                            `f`.`updated_at`
                    FROM `feature` `f`
                    INNER JOIN `user` `u` ON `u`.`id` = `f`.`user_id`
                    ORDER BY feature_id DESC";

            $results = $this->findAll($req);
            $featuresArray = [];

            foreach ($results as $result) {
                $feature = new Feature();
                $feature->populate($result);
                $featuresArray[] = $feature;
            }
            return $featuresArray;
        } catch (\Exception $e) {
            echo $e->getMessage();
            return [];
        }
    }

    /**
     * Cette méthode permet de mettre à jour les informations d'une MAJ dans la base de données.
     *
     * @param array $params - Les paramètres mis à jour de la MAJ.
     * @param int $id - ID de la MAJ à mettre à jour.
     * @return bool - Renvoie true en cas de succès, sinon false.
     */
    public function updateFeature(array $params, int $id): bool
    {
        try {
            $req = "UPDATE `feature`
                    SET `type` = :type,
                        `title` = :title,
                        `description` = :description,
                        `status` = :status,
                        `updated_at` = NOW()
                    WHERE `id` = :id";

            $query = $this->db->prepare($req);
            $params['id'] = $id;

            return $query->execute($params);

        } catch (\Exception $e) {
            echo $e->getMessage();
            return false;
        }
    }

    /**
     * Cette méthode permet de mettre à jour le status d'une MAJ dans la base de données.
     *
     * @param int $id - ID de la MAJ à mettre à jour.
     * @return bool - Renvoie true en cas de succès, sinon false.
     */
    public function updateStatusFeature(array $params, int $id): bool
    {
        try {

            $req = "UPDATE `feature`
                    SET `status` = :status,
                        `updated_at` = NOW()
                    WHERE `id` = :id";

            $query = $this->db->prepare($req);
            $params['id'] = $id;

            return $query->execute($params);
        } catch (\Exception $e) {
            echo $e->getMessage();
            return false;
        }
    }


    /**
     * Cette méthode permet de supprimer une feature de la base de données.
     *
     * @param int $id - L'ID de la feature à supprimer.
     * @return bool - Renvoie true en cas de succès, sinon false.
     */
    public function deleteFeature(int $id)
    {
        try {
            $req = "DELETE FROM `feature`
                    WHERE `id` = :id";
            $query = $this->db->prepare($req);
            return $query->execute(['id' => $id]);
        } catch (\Exception $e) {
            echo $e->getMessage();
            return [];
        }
    }
}








