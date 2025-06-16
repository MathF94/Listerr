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

namespace Entity;

/**
 * Classe représentant une réservation.
 */
class Reservation
{
    public int $id;
    public string $name;
    public string $email;
    public int $listId;
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
        $this->name = $params['name'];
        $this->email = $params['email'];
        $this->listId = $params['list_id'];
        $this->cardId = $params['card_id'];
        $this->createdAt = $params['created_at'];
    }
}
