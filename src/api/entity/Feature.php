<?php

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
    public string $title;
    public string $type;
    public string $description;
    public string $status;
    public string $createdAt;
    public string $updatedAt;

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

        $this->id = $params['id'];
        $this->title = $params['title'];
        $this->type = $params['type'];
        $this->description = $params['description'];
        $this->status = $params['status'];
        $this->createdAt = $params['created_at'];
        $this->updatedAt = $params['updated_at'];
    }
}
