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
 * Classe représentant une carte.
 */
class Card
{
    public int $id;
    public string $title;
    public string $description;
    public int $priority;
    public string $createdAt;
    public string $updatedAt;
    public int $listId;

    /**
     * Initialise les propriétés de l'objet d'une carte à partir d'un tableau associatif de paramètres.
     * Instancie la classe Lister et récupère également les propriétés de l'objet utilisateur à partir de ce même tableau associatif de paramètres.
     *
     * @param array $params - Tableau associatif contenant les données d'une carte à peupler.
     * @return void
     */
    public function populate(array $params): void
    {
        $this->id = $params['id'];
        $this->title = $params['title'];
        $this->description = $params['description'];
        $this->priority = $params['priority'];
        $this->createdAt = $params['created_at'];
        $this->updatedAt = $params['updated_at'];
        $this->listId = $params['list_id'];
    }
}
