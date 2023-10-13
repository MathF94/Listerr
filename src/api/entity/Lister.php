<?php

namespace Entity;

class Lister
{
    // const TYPE_WISH = 1;
    // const TYPE_TODO = 2;
    // const TYPES = [
    //     self::TYPE_WISH => 'Wishlist',
    //     self::TYPE_TODO => 'Todolist',
    // ];

    public int $id;
    public string $type;
    public string $title;
    public string $description;
    public string $userId;
    // public bool $isWish;

    // public function setIsWish(bool $value): lister
    // {
    //     $this->isWish = (int)$value === self::TYPE_WISH;
    //     return $this;
    // }

    // public function setType(int $value): lister
    // {
    //     $this->type = self::TYPES[$value];
    //     return $this;
    // }

    public function populate(array $params): void
    {
        $this->id = $params['id'];
        $this->type = $params['type'];
        $this->title = $params['title'];
        $this->description = $params['description'];
        $this->userId = $params['user_id'];
        // $this->setType($params['type_id'])
        //     ->setIsWish($params['type_id']);
    }
}
