<?php

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
    public int $checked;
    public string $login;
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
        $this->checked = !empty($params['checked']) ? (int)$params['checked'] : 0;
        $this->login = $params['login'];
        $this->createdAt = $params['created_at'];
        $this->updatedAt = $params['updated_at'];
        $this->listId = $params['list_id'];
    }
}
