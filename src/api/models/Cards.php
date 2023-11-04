<?php

namespace Models;

use Entity\Card;
use Services\Database;

/**
 * La classe Lists gère les opérations liées aux listes dans la base de données.
 */
class Cards extends Database
{

    public function getAllByList(int $listId): array
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
                    WHERE `l`.`id` = :id";

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
}
