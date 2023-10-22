<?php

namespace Controllers;

use Models\Lists;
use Models\Users;
use Services\Session;
use Services\Validator;

class ListController
{
    private $validator;
    private $user;

    public function __construct($tokenUser)
    {
        $this->validator = new Validator();
        $session = new Session();
        $decrypt = $session->decrypt($tokenUser);
        $model = new Users();
        $this->user = $model->auth($decrypt["login"], $decrypt["password"]);
    }

    public function create(): string
    {
        try {
            if (!empty($this->user)) {
                $errors = $this->validator->isValidParams($_POST, Validator::CONTEXT_CREATE_LIST);

                if (empty(count($errors))) {
                    $params = $_POST;
                    $model = new Lists();
                    $model->create($params, $this->user->id);

                    return json_encode([
                        'status' => 'success'
                    ]);
                }

                $errors = $this->validator->isValidParams($_POST, Validator::CONTEXT_CREATE_LIST);
                return json_encode([
                    'status' => 'fail',
                    'errors' => $errors
                ]);
            }
        } catch (\Exception $e) {
            return json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    /**
     * retourne une liste d'un utilisateur en fonction de l'id de la liste sélectionnée
     */
    public function readOneListById() {
        try {
            if (!empty($_GET['id'])) {
                $id = $_GET['id'];
                $model = new Lists();
                $list = $model->oneListById((int)$id);

                if (empty($list)) {
                    return json_encode([
                        'status' => 'no list'
                    ]);
                };

                return json_encode([
                    'status' => 'readOneList',
                    'data' => $list
                ]);
            };

            return json_encode([
                'status' => 'fail',
                'message' => 'body is empty'
            ]);
            
        } catch (\Exception $e) {
            return json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    /**
     * Toutes les listes d'un utilisateur
     */
    public function readListsOneUser(): string
    {
        try {
            if (!empty($this->user)) {
                $model = new Lists();
                $list = $model->listsOneUser($this->user->id);

                if (empty($list)) {
                    return json_encode([
                        'status' => 'unknown user'
                    ]);
                };

                return json_encode([
                    'status' => 'read',
                    'data' => $list
                ]);
            };
            return json_encode([
                'status' => 'fail',
                'message' => 'body is empty'
            ]);
        } catch (\Exception $e) {
            return json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        };
    }

    /**
     * Toutes les listes de tous les utilisateurs avec login
     */
    public function readAllByUsers(): string
    {
        try {
            if (!empty($this->user)) {
                $model = new Lists();
                $list = $model->listsByUsers();

                if (empty($list)) {
                    return json_encode([
                        'status' => 'unknown user'
                    ]);
                };

                return json_encode([
                    'status' => 'read',
                    'data' => $list,
                ]);
            };
            return json_encode([
                'status' => 'fail',
                'message' => 'body is empty'
            ]);
        } catch (\Exception $e) {
            return json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    public function deleteList(int $id): string
    {
        try {            
            if (!empty($this->user->id)) {
                $model = new Lists();
                $list = $model->oneList((int)$id);
                
                if (!empty($list)) {
                    $listId = (int)$list['id'];
                    $model->deleteList($listId);
                    
                    return json_encode([
                        'status' => 'deleted',
                        'message' => 'la liste a bien été supprimée.'
                    ]);
                };
                return json_encode(['status' => 'fail']);
            }
        } catch (\Exception $e) {
            return json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        };
    }
}
