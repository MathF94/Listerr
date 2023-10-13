<?php

namespace Controllers;

use Entity\Lister;
use Entity\User;
use Models\Lists;
use Services\Session;
use Services\Validator;

class ListController
{
    private $validator;

    public function __construct()
    {
        $this->validator = new Validator();
    }

    public function create($tokenUser)
    {
        try {
            if (!empty($tokenUser)) {
                $errors = $this->validator->isValidParams($_POST, Validator::CONTEXT_CREATE_LIST);

                if (empty(count($errors))) {
                    $params = $_POST;

                    $session = new Session();
                    $decrypt = $session->decrypt($tokenUser);
                    $userId = $decrypt['id'];
                    $model = new Lists();
                    $model->create($params, $userId);

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

    public function readListByUser($tokenUser): string
    {
        try {
            if (!empty($tokenUser)) {
                $session = new Session();
                $decrypt = $session->decrypt($tokenUser);
                $userId = $decrypt['id'];

                $model = new Lists();
                $type = $model->readOne($userId)->type;
                $list = $model->listByUser($userId, $type);

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


    public function readAll($tokenUser): string
    {
        try {
            if (!empty($tokenUser)) {
                $session = new Session();
                $decrypt = $session->decrypt($tokenUser);

                $model = new Lists();
                $list = $model->readAll();

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
        };
    }

}