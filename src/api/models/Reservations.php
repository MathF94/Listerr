<?php

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
            $req = "INSERT INTO `reservation` (`guestName`, `user_id`, `card_id`)
            VALUES (:guestName, :user_id, :card_id)";

            $params = [
                'guestName' => $params['guestName'],
                'user_id' => $params['userId'],
                'card_id' => $params['id']
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
     * @param int $id - ID de la réservation à récupérer.
     * @return Reservation|null - L'objet Reservation correspondant à la réservation ou null si non trouvé.
     */
    public function getOneReservationById(int $id): ?Reservation
    {
        try {
            $req = "SELECT `id`,
                            `guestName`,
                            `user_id`,
                            `card_id`,
                            `created_at`
                    FROM `reservation`
                    WHERE `card_id` = :id
                    ORDER BY created_at DESC";

            $result = $this->findOne($req, ['id' => $id]);
            // var_dump($result);die();

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
     * Cette méthode permet d'annuler une réservation de la base de données.
     *
     * @param int $id - L'ID de la réservation à annuler.
     * @return bool - Renvoie true en cas de succès, sinon false.
     */
    public function cancelReservation(int $id): bool
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