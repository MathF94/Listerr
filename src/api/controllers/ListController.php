<?php

namespace Controllers;

use Models\Lists;
use Models\Users;
use Services\CSRFToken;
use Services\Session;
use Services\Validator;

class ListController
{
    private $csrfToken;
    private $validator;
    private $user;

    public function __construct($tokenUser)
    {
        $this->csrfToken = new CSRFToken();
        $this->validator = new Validator();
        $session = new Session();

        if (!empty($tokenUser)) {
            $decrypt = $session->decrypt($tokenUser);
            $model = new Users();
            $this->user = $model->auth($decrypt["login"], $decrypt["password"]);
        }
    }

    public function CSRFToken()
    {
        try {
            $formId = $_POST['formId'];
            var_dump($formId);
            $encryptedCSRFToken = $this->csrfToken->encrypt($formId);

            return json_encode([
                'status' => 'success',
                'csrfToken' => $encryptedCSRFToken,
            ]);

            return json_encode([
                'status' => 'fail',
                'errors' => 'errors'
            ]);

        } catch (\Exception $e) {
            return json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    public function create($csrfToken): string
    {
        try {
            $validToken = $this->csrfToken->isValidToken($csrfToken, "createListForm");

            if (!$validToken) {
                return json_encode([
                    'status' => 'fail',
                    'message' => 'jeton invalide'
                ]);
            }

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
    public function readOneListById()
    {
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

                if ($list->type === "TodoList") {
                    if (empty($this->user) || $this->user->id !== $list->user->id) {
                        return json_encode([
                            'status' => 'no list'
                        ]);
                    }
                }

                return json_encode([
                    'status' => 'readOneList',
                    'user_id' => $this->user->id ?? 0,
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

    public function updateList(int $id, string $csrfToken): string
    {
        try {
            $validToken = $this->csrfToken->isValidToken($csrfToken, "updateFormList");

            if (!$validToken) {
                return json_encode([
                    'status' => 'fail',
                    'message' => 'jeton invalide'
                ]);
            }

            if (!empty($this->user->id)) {
                $model = new Lists();
                $list = $model->oneListById((int)$id);

                $errors = $this->validator->isValidParams($_POST, Validator::CONTEXT_UPDATE_LIST);
                if (empty(count($errors))) {
                    $listId = (int)$list->id;

                    $params = [
                        'title' => $_POST['title'],
                        'type' => $_POST['type'],
                        'description' => $_POST['description']
                    ];
                }

                $model->updateList($params, $listId);

                return json_encode([
                    'status' => 'updated',
                    'message' => 'la liste a bien été mise à jour.'
                ]);

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

    public function deleteList(int $id): string
    {
        try {
            if (!empty($this->user->id)) {
                $model = new Lists();
                $list = $model->oneListById((int)$id);

                if (!empty($list)) {
                    $listId = (int)$list->id;
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
