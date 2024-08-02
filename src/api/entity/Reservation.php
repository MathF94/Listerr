<?php

namespace Entity;

/**
 * Classe représentant une réservation.
 */
class Reservation
{
    public int $id;
    public string $login;
    public int $cardId;
    public string $createdAt;

    /**
     * Initialise les propriétés de l'objet d'une réservation à partir d'un tableau associatif de paramètres.
     * Instancie la classe Lister et récupère également les propriétés de l'objet utilisateur à partir de ce même tableau associatif de paramètres.
     *
     * @param array $params - Tableau associatif contenant les données d'une réservation à peupler.
     * @return void
     */
    public function populate(array $params): void
    {
        $this->id = $params['id'];
        $this->login = $params['guestName'];
        $this->cardId = $params['card_id'];
        $this->createdAt = $params['created_at'];
    }
}
