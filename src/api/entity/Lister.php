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

use Models\Cards;
/**
 * Classe représentant une liste, qui peut être de type "WishList" ou "TodoList".
 */
class Lister
{
    public const TYPE_WISH = 'WishList';
    public const TYPE_TODO = 'TodoList';

    public int $id;
    public string $type;
    public string $title;
    public string $description;
    public string $createdAt;
    public string $updatedAt;
    public int $userId;
    public User $user;
    public array $cards;

    /**
     * Initialise les propriétés de l'objet d'une liste à partir d'un tableau associatif de paramètres.
     * Instancie la classe User et récupère également les propriétés de l'objet utilisateur à partir de ce même tableau associatif de paramètres.
     *
     * @param array $params - Tableau associatif contenant les données d'une liste à peupler.
     * @return void
     */
    public function populate(array $params): void
    {
        if (empty($params)) {
            return;
        }

        $this->id = $params['list_id'];
        $this->type = $params['type'];
        $this->title = $params['title'];
        $this->description = $params['description'];
        $this->createdAt = $params['created_at'];
        $this->updatedAt = $params['updated_at'];
        $this->userId = $params['user_id'];

        $this->user = new User();
        $this->user->populate($params);

        $model = new Cards();
        // Récupère toutes les cartes d'une liste en fonction de son ID $this->id
        $this->cards = $model->getAllCardsByList($this->id);
    }
}
