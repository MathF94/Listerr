<?php

/*
 * listerr - gestionnaire de listes et tâches
 * Copyright (C) 2025 Mathieu Fagot
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

namespace Models;

use Entity\Reservation;
use Services\Database;

/**
 * La classe Cards gère les opérations liées aux réservations dans la base de données.
 */
class Reservations extends Database
{
    /**
     * Cette méthode permet de créer une nouvelle réservation dans la base de données.
     *
     * @param array $params - Les paramètres de la réservation à créer.
     * @return bool - Renvoie true en cas de succès, sinon false.
     */
    public function createReservation(array $params): bool
    {
        try {
            $req = "INSERT INTO `reservation` (`name`, `email`, `list_id`, `card_id`)
            VALUES (:name, :email, :list_id, :card_id)";

            $params = [
                'name' => $params['name'],
                'email' => $params['email'],
                'list_id' => $params['list_id'],
                'card_id' => $params['card_id'],
            ];

            $this->executeReq($req, $params);
            return true;
        } catch (\Exception $e) {
            echo $e->getMessage();
            return false;
        }
    }

    /**
     * Cette méthode permet de récupérer les détails d'une réservation en fonction de son ID.
     *
     * @param int $id - ID de l'invité qui a réservé pour récupérer son login.
     * @return Reservation|null - L'objet Reservation correspondant à la réservation ou null si non trouvé.
     */
    public function getAllReservationByListId(int $listId): ?array
    {
        try {
            $req = "SELECT `r`.`id`,
                            `r`.`name`,
                            `r`.`email`,
                            `r`.`list_id`,
                            `r`.`card_id`,
                            `r`.`created_at`
                    FROM `reservation` `r`
                    INNER JOIN `list` `l` ON `r`.`list_id` = `l`.`id`
                    WHERE `l`.`id` = :id
                    ORDER BY created_at DESC";

            $results = $this->findAll(
                $req,
                ['id' => $listId]
            );

            if (empty($results)) {
                return null;
            }

            $reservationArray = [];

            foreach($results as $result) {
                $reservation = new Reservation();
                $reservation->populate($result);
                $reservationArray[] = $reservation;
            }
            return $reservationArray;
        } catch (\Exception $e) {
            echo $e->getMessage();
            return null;
        }
    }
    /**
     * Cette méthode permet de récupérer les détails d'une réservation en fonction de son ID.
     *
     * @param int $id - ID de la réservation à récupérer.
     * @return Reservation|null - L'objet Reservation correspondant à la réservation ou null si non trouvé.
     */
    public function getOneReservationById(int $id): ?Reservation
    {
        try {
            $req = "SELECT `id`,
                            `name`,
                            `email`,
                            `list_id`,
                            `card_id`,
                            `created_at`
                    FROM `reservation`
                    WHERE `card_id` = :id
                    ORDER BY created_at DESC";

            $result = $this->findOne($req, ['id' => $id]);

            if (empty($result)) {
                return null;
            }

            $reservation = new Reservation();
            $reservation->populate($result);

            return $reservation;
        } catch (\Exception $e) {
            echo $e->getMessage();
            return null;
        }
    }
    /**
     * Cette méthode permet de relier les données de la table reservation avec
     * celles de la table user, en utilisant les colonnes mail
     * comme critère de correspondance.
     */

    public function getReservationsLinkedUsers(): ?array
    {
        try {
            $req = "SELECT `r`.`id`,
                            `r`.`name`,
                            `r`.`email`,
                            `u`.`id`,
                            `u`.`name`,
                            `u`.`email`
                    FROM `reservation` `r`
                    LEFT JOIN `user` `u` ON `u`.`email` = `r`.`email`";

            $results = $this->findAll($req);

            if (empty($results)) {
                return null;
            }
            return $results;

        } catch (\Exception $e) {
            echo $e->getMessage();
            return null;
        }
    }
    /**
     * Cette méthode permet d'annuler une réservation de la base de données.
     *
     * @param int $id - L'ID de la réservation à annuler.
     * @return bool - Renvoie true en cas de succès, sinon false.
     */
    public function cancelReservation(int $id)
    {
        try {
            $req = "DELETE FROM `reservation`
                    WHERE `id` = :id";

            $query = $this->db->prepare($req);
            return $query->execute(['id' => $id]);
        } catch (\Exception $e) {
            echo $e->getMessage();
            return [];
        }
    }
}