<?php

namespace Listerr\Model;

use Listerr\Entity\Card;
use Listerr\Service\Database;

/**
 * La classe Cards gère les opérations liées aux cartes dans la base de données.
 */
class Cards extends Database
{
    /**
     * Cette méthode permet de créer une nouvelle carte dans la base de données.
     *
     * @param array $params - Les paramètres de la carte à créer.
     * @return bool - Renvoie true en cas de succès, sinon false.
     */
    public function create(array $params): bool
    {
        try {
            $req = "INSERT INTO `card` (`title`, `description`, `priority`, `list_id`)
            VALUES (:title, :description, :priority, :list_id)";

            $params = [
                'title' => $params['titleCard'],
                'description' => $params['descriptionCard'],
                'priority' => $params['priority'],
                'list_id' => $params['list_id']
            ];

            $this->executeReq($req, $params);
            return true;
        } catch (\Exception $e) {
            echo $e->getMessage();
            return false;
        }
    }

    /**
     * Cette méthode permet de récupérer les détails d'une carte en fonction de son ID.
     *
     * @param int $id - ID de la carte à récupérer.
     * @return Card|null - L'objet Cqrd correspondant à lq cqrte ou null si non trouvé.
     */
    public function getOneCardById(int $id): ?Card
    {
        try {
            $req = "SELECT `id`,
                            `title`,
                            `description`,
                            `priority`,
                            `checked`,
                            `list_id`,
                            `created_at`,
                            `updated_at`
                    FROM `card`
                    WHERE `id` = :id
                    ORDER BY created_at DESC";

            $result = $this->findOne($req, ['id' => $id]);
            $card = new Card();
            $card->populate($result);
            return $card;
        } catch (\Exception $e) {
            echo $e->getMessage();
            return null;
        }
    }

    /**
     * Cette méthode permet de récupérer toutes les cartes en fonction de l'ID de la liste.
     *
     * @param int $listId - ID de la liste pour récupérer les cartes associées.
     * @return Card[] - Un tableau d'objets Card représentant tous les cartes.
     */
    public function getAllCardsByList(int $listId): array
    {
        try {
            $req = "SELECT `c`.`id`,
                            `c`.`title`,
                            `c`.`description`,
                            `c`.`priority`,
                            `c`.`checked`,
                            `c`.`list_id`,
                            `c`.`created_at`,
                            `c`.`updated_at`
                    FROM `card` `c`
                    INNER JOIN `list` `l`  ON `c`.`list_id` = `l`.`id`
                    WHERE `l`.`id` = :id
                    ORDER BY `c`.`priority` DESC";

            $results = $this->findAll(
                $req,
                ['id' => $listId]
            );
            $cardsArray = [];

            foreach ($results as $result) {
                $card = new Card();
                $card->populate($result);
                $cardsArray[] = $card;
            }
            return $cardsArray;
        } catch (\Exception $e) {
            echo $e->getMessage();
            return null;
        }
    }

    /**
     * Cette méthode permet de mettre à jour les informations d'une carte dans la base de données.
     *
     * @param array $params - Les paramètres mis à jour de la carte.
     * @param int $id - L'ID de la carte à mettre à jour.
     * @return bool - Renvoie true en cas de succès, sinon false.
     */
    public function updateCard(array $params, int $id): bool
    {
        try {
            $req = "UPDATE `card`
                    SET `title` = :title,
                        `description` = :description,
                        `priority` = :priority,
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
     * Cette méthode permet de mettre à jour l'input check (réservation) d'une carte dans la base de données.
     *
     * @param array $params - Les paramètres mis à jour de la carte.
     * @param int $id - L'ID de la carte à mettre à jour.
     * @return bool - Renvoie true en cas de succès, sinon false.
     */
    public function updateChecked(array $params, int $id): bool
    {
        try {
            $req = "UPDATE `card`
                    SET `checked` = :checked
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
     * Cette méthode permet de supprimer une carte de la base de données.
     *
     * @param int $id - L'ID de la carte à supprimer.
     * @return bool - Renvoie true en cas de succès, sinon false.
     */
    public function deleteCard(int $id): bool
    {
        try {
            $req = "DELETE FROM `card`
                    WHERE `id` = :id";

            $query = $this->db->prepare($req);
            return $query->execute(['id' => $id]);
        } catch (\Exception $e) {
            echo $e->getMessage();
            return [];
        }
    }
}
