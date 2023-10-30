<?php

namespace Entity;

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

    public function populate(array $params): void
    {
        $this->id = $params['list_id'];
        $this->type = $params['type'];
        $this->title = $params['title'];
        $this->description = $params['description'];
        $this->createdAt = $params['created_at'];
        $this->updatedAt = $params['updated_at'];
        $this->userId = $params['user_id'];

        $this->user = new User();
        $this->user->populate($params);
    }
}
