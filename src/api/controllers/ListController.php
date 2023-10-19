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

    // liste par utilisateur
    public function readListByUser(): string
    {
        try {
            if (!empty($this->user)) {
                $model = new Lists();
                $list = $model->listByUser($this->user->id);

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

    // liste pour l'admin avec login utilisateur
    public function readAllByUser(): string
    {
        try {
            if (!empty($this->user)) {
                $model = new Lists();
                $list = $model->readAllByUser();

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

    public function delete(): string
    {
        try {
            if (!empty($this->user)) {
                $model = new Lists();
                $list = $model->readOne($this->user->id);

                if (!empty($list)) {
                    $list = $model->delete($list->id);

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
