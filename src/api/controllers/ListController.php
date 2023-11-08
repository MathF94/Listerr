<?php

namespace Controllers;

use Entity\Lister;
use Models\Lists;
use Models\Users;
use Services\CSRFToken;
use Services\Session;
use Services\Validator;

/**
 * Classe représentant un objet d'une liste.
 */
class ListController
{
    private $csrfToken;
    private $validator;
    private $user;

    /**
     * Constructeur de la classe ListController.
     *
     * Ce constructeur initialise les dépendances nécessaires et authentifie un utilisateur
     * en utilisant un jeton fourni. Il est appelé lors de la création d'une instance de ListController.
     *
     * @param string $tokenUser - Le jeton d'utilisateur utilisé pour l'authentification.
     */
    public function __construct($tokenUser)
    {
        $this->csrfToken = new CSRFToken();
        $this->validator = new Validator();
        $session = new Session();

        // Si un jeton d'utilisateur est fourni, nous tentons de décrypter et d'authentifier l'utilisateur.
        if (!empty($tokenUser)) {
            $decrypt = $session->decrypt($tokenUser);
            $model = new Users();
            $this->user = $model->auth($decrypt["login"], $decrypt["password"]);
        }
    }

    /**
     * Aide au chiffrement du jeton CSRF en réponse à une requête.
     *
     * Cette méthode récupère le champ 'formId' de la variable superglobale $_POST, qui correspond à l'id du formulaire renvoyé via le CSRFToken.js,
     *               chiffre cette valeur et l'envoie en paramètre de la méthode encrypt() pour générer un CSRF Token.
     * La méthode renvoie ensuite le résultat encodé en JSON.
     *
     * @return string - Le résultat est encodé au format JSON avec le statut "success" et le jeton CSRF en cas de succès.
     *                - Le résultat est encodé au format JSON avec le statut "error" et un message d'erreur en cas d'échec.
     */
    public function CSRFToken()
    {
        try {
            $formId = $_POST['formId'];
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

    /**
     * Cette méthode permet la création d'une nouvelle liste, après validation du jeton CSRF.
     *
     * @param string $csrfToken - Jeton CSRF pour valider la requête.
     * @return string - Réponse JSON : "success" en cas de succès, "fail" avec un message d'erreur en cas d'échec.
     */
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
            }

            return json_encode([
                'status' => 'fail',
                'errors' => $errors
            ]);
        } catch (\Exception $e) {
            return json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    /**
     * Cette méthode récupère les détails d'une liste, en fonction de l'id de la liste, fourni via la requête HTTP.
     *
     * @return string - Réponse JSON contenant les informations de la liste ou un message d'erreur.
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

                // Vérifie sur la liste est une TodoList
                if ($list->type === Lister::TYPE_TODO) {
                    // Vérifie si la TodoList appartient à l'utilisateur connecté
                    // S'il est différent, la réponse JSON renvoie "no list"
                    if (empty($this->user) || $this->user->id !== $list->user->id) {
                        return json_encode([
                            'status' => 'no list'
                        ]);
                    }
                }

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
     * Cette méthode récupère les informations de toutes les listes pour un utilisateur.
     *
     * @return string - Réponse JSON contenant les informations de la liste ou un message d'erreur.
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
     * Cette méthode récupère les informations de toutes les listes de tous les utilisateurs.
     *
     * @return string - Réponse JSON contenant les informations de toutes les listes ou un message d'erreur.
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

    /**
     * Cette méthode permet la mise à jour des informations d'une liste d'un utilisateur, après validation du jeton CSRF.
     *
     * @return string - Réponse JSON contenant un message de validaiton de mise à jour ou un message d'erreur.
     */
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
                $list = $model->oneListById($id);

                $errors = $this->validator->isValidParams($_POST, Validator::CONTEXT_UPDATE_LIST);
                if (empty(count($errors))) {
                    $listId = $list->id;

                    $params = [
                        'title' => $_POST['titleList'],
                        'type' => $_POST['type'],
                        'description' => $_POST['descriptionList']
                    ];
                    $model->update($params, $listId);
                    return json_encode([
                        'status' => 'updated',
                        'message' => 'la liste a bien été mise à jour.'
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
     * Cette méthode récupère la suppression d'une liste d'un utilisateur.
     *
     * @return string - Réponse JSON contenant un message de succès ou un message d'erreur.
     */
    public function deleteList(int $id): string
    {
        try {
            if (!empty($this->user->id)) {
                $model = new Lists();
                $list = $model->oneListById($id);

                if (!empty($list)) {
                    $listId = $list->id;
                    $model->delete($listId);

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
