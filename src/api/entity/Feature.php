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
 * Classe représentant un utilisateur, qui peut être de type "Admin" ou "User".
 */
class Feature
{
    public const TYPE_FEATURE = 'Evolution';
    public const TYPE_FIXED = 'Correctif';
    public const TYPE_SUGGEST = 'Suggestion';

    public int $id;
    public string $type;
    public string $title;
    public string $description;
    public string $status;
    public int $userId;
    public string $createdAt;
    public string $updatedAt;
    public User $user;

    /**
     * Initialise les propriétés de l'objet utilisateur à partir d'un tableau associatif de paramètres.
     *
     * @param array $params - Tableau associatif contenant les données utilisateur à peupler.
     * @return void
     */
    public function populate(array $params): void
    {
        if (empty($params)) {
            return;
        }

        $this->id = $params['feature_id'];
        $this->type = $params['type'];
        $this->title = $params['title'];
        $this->description = $params['description'];
        $this->status = $params['status'];
        $this->createdAt = $params['created_at'];
        $this->updatedAt = $params['updated_at'];
        $this->userId = $params['user_id'];

        $this->user = new User();
        $this->user->populate($params);
    }
}
