<?php

namespace Controllers;

use Entity\Lister;
use Models\Lists;
use Models\Users;
use Services\CSRFToken;
use Services\SendMail;
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
     * Ce constructeur initialise les dépendances nécessaires et authentifie un utilisateur, en utilisant un jeton fourni.
     * Il est appelé lors de la création d'une instance de ListController.
     *
     * @param string $tokenUser - Le jeton d'utilisateur utilisé pour l'authentification.
     */
    public function __construct($tokenUser)
    {
        $this->csrfToken = new CSRFToken();
        $this->validator = new Validator();
        $session = new Session();

        // Si un jeton d'utilisateur est fourni, l'utilisateur est décrypté et d'authentifié.
        if (!empty($tokenUser)) {
            $decrypt = $session->decrypt($tokenUser);
            $model = new Users();
            $this->user = $model->auth($decrypt["login"], $decrypt["password"]);
        }
    }

    /**
     * Aide au chiffrement du jeton CSRF en réponse à une requête.
     *
     * Cette méthode récupère le champ "formId" du $_POST, qui correspond à l'ID du formulaire renvoyé via le CSRFToken.js,
     *               chiffre cette valeur et l'envoie en paramètre de la méthode encrypt() pour générer un CSRF Token.
     *
     * @return string - Réponse JSON : "success" avec le jeton CSRF chiffré, en cas de succès.
     *                                 "fail" avec un message d'erreur, en cas d'échec.
     */
    public function CSRFToken(): string
    {
        try {
            $formId = $_POST["formId"];
            $encryptedCSRFToken = $this->csrfToken->encrypt($formId);

            return json_encode([
                "status" => "success List csrfToken",
                "csrfToken" => $encryptedCSRFToken,
            ]);

        } catch (\Exception $e) {
            return json_encode([
                "status" => "errors",
                "message" => $e->getMessage()
            ]);
        }
    }

    /**
     * Cette méthode permet la création d'une nouvelle liste, après validation du jeton CSRF.
     * @param string $csrfToken - Jeton CSRF pour valider la requête.
     *
     * @return string - Réponse JSON : "createList" avec un message, en cas de succès.
     *                                 "createList failed" avec un message d'erreur, si l'utilisateur est introuvable.
     *                                 "fail" avec un message d'erreur, si le jeton est invalide.
     *                                 "errors" avec un message d'erreur, en cas d'échec.
     */
    public function createList(string $csrfToken): string
    {
        try {
            $validToken = $this->csrfToken->isValidToken($csrfToken, "formList");
            if (!$validToken) {
                return json_encode([
                    "status" => "fail",
                    "message" => "no valid csrfToken"
                ]);
            }

            if (!empty($this->user)) {
                $errors = $this->validator->isValidParams($_POST, Validator::CONTEXT_CREATE_LIST);
                
                if (empty(count($errors))) {
                    $params = $_POST;
                    $model = new Lists();
                    $create = $model->createList($params, $this->user->id);

                    if ($create) {
                        if ($params['typeList'] === 'WishList') {
                            $sendMail = new SendMail();
                            $mail = $sendMail->getElementMailList($params, $this->user);
                            if ($mail) {
                                return json_encode([
                                    "status" => "createList",
                                    "message" => "la liste a bien été créée."
                                ]);
                            }
                        }
                    }
                    return json_encode([
                        "status" => "no createList",
                        "message" => "la liste ne s'est pas créée."
                    ]);
                }
                return json_encode([
                    "status" => "errors",
                    "errors" => $errors
                ]);
            }
            return json_encode([
                "status" => "createList failed",
                "message" => "no user found"
            ]);
        } catch (\Exception $e) {
            return json_encode([
                "status" => "errors",
                "message" => $e->getMessage()
            ]);
        }
    }

    /**
     * Cette méthode récupère en fonction de l'ID de la liste, sur la page list.html :
     *       ==> les détails d'une seul liste,
     *                       de l'utilisateur,
     *                       des cartes associés à la liste.
     *
     * @return string - Réponse JSON : "readOneList" avec les data d'une liste, en cas de succès.
     *                                 "readOneList failed" avec un message d'erreur, si l'ID est vide.
     *                                 "fail" avec un message d'erreur, si la liste est introuvable.
     *                                 "errors" avec un message d'erreur, en cas d'échec.
     */
    public function readOneListById(): string
    {
        try {
            if (!empty($_GET['id']) && is_numeric($_GET['id'])) {
                $id = $_GET['id'];
                $model = new Lists();
                $list = $model->getOneListById((int)$id);

                if (empty($list)) {
                    return json_encode([
                        "status" => "fail",
                        "errors" => "no list found"
                    ]);
                }
                // Vérifie sur la liste est de type TodoList
                if ($list->type === Lister::TYPE_TODO) {
                    // Vérifie si la TodoList appartient à l'utilisateur connecté
                    // S'il est différent, la réponse JSON renvoie "no list found"
                    if (empty($this->user) || $this->user->id !== $list->user->id) {
                        return json_encode([
                            "status" => "fail",
                            "errors" => "no list found"
                        ]);
                    }
                }
                return json_encode([
                    "status" => "readOneList",
                    "data" => $list
                ]);
            }
            return json_encode([
                "status" => "readOneList failed",
                "message" => "ID not numeric"
            ]);
        } catch (\Exception $e) {
            return json_encode([
                "status" => "errors",
                "message" => $e->getMessage()
            ]);
        }
    }

    /**
     * Cette méthode récupère en fonction de l'ID de l'utilisateur, sur la page lists.html :
     *       ==> les détails de toutes les listes,
     *                       de l'utilisateur,
     *                       des cartes associés à la liste.
     *
     * @return string - Réponse JSON : "readAllListsByUser" avec les data des listes, en cas de succès.
     *                                 "readAllListsByUser failed" avec un message d'erreur, si l'utilisateur est introuvable.
     *                                 "standBy" avec un message d'erreur, si aucune liste n'est encore créée.
     *                                 "errors" avec un message d'erreur, en cas d'éch
     */
    public function readAllListsByUser(?int $userId = null): string
    {
        try {
            if (!empty($this->user)) {
                $model = new Lists();
                // Dans la page profil.html
                $lists = $model->AllListsByUser($this->user->id);

                if (empty($userId)) {
                    if (empty($lists)) {
                        return json_encode([
                            "status" => "standBy",
                            "errors" => "no lists created yet"
                        ]);
                    } else {
                        return json_encode([
                            "status" => "readAllListsByUser",
                            "data" => $lists
                        ]);
                    }

                } else {
                    // Dans la page profil.html?id=XXX
                    $lists = $model->AllListsByUser($userId);
                    if (!empty($userId)) {
                        if (empty($lists)) {
                            return json_encode([
                                "status" => "standBy",
                                "errors" => "no lists created yet"
                            ]);
                        } else {
                            return json_encode([
                                "status" => "readAllListsByUser",
                                "data" => $lists
                            ]);
                        }
                    }
                }
            };
            return json_encode([
                "status" => "readAllListsByUser failed",
                "message" => "no user found"
            ]);
        } catch (\Exception $e) {
            return json_encode([
                "status" => "errors",
                "message" => $e->getMessage()
            ]);
        };
    }

    /**
     * Cette méthode récupère sur la page home.html :
     *       ==> les détails de toutes les listes,
     *                       de tous les utilisateurs,
     *                       des cartes associés aux listes.
     *
     * @return string - Réponse JSON : "readAllListsAllUsers" avec les data des listes, en cas de succès.
     *                                 "readAllListsAllUsers failed" avec un message d'erreur, si l'utilisateur est introuvable.
     *                                 "standBy" avec un message d'erreur, si aucune liste n'est encore créée.
     *                                 "errors" avec un message d'erreur, en cas d'éch
     */
    public function readAllListsAllUsers(): string
    {
        try {
            if (!empty($this->user)) {
                $model = new Lists();
                $lists = $model->AllListsAllUsers();

                if (empty($lists)) {
                    return json_encode([
                        "status" => "standBy",
                        "errors" => "no lists created yet"
                    ]);
                };
                return json_encode([
                    "status" => "readAllListsAllUsers",
                    "data" => $lists,
                ]);
            };
            return json_encode([
                "status" => "readAllListsAllUsers failed",
                "message" => "no user found"
            ]);
        } catch (\Exception $e) {
            return json_encode([
                "status" => "errors",
                "message" => $e->getMessage()
            ]);
        }
    }

    /**
     * Cette méthode permet la mise à jour des informations d'une liste d'un utilisateur, après validation du jeton CSRF.
     * @param int $id - L'ID de la liste à mettre à jour.
     * @param string $csrfToken - Jeton CSRF pour valider la requête.
     *
     * @return string - Réponse JSON : "updateList" avec un message, en cas de succès.
     *                                 "updateList failed" avec un message d'erreur, si l'utilisateur est introuvable.
     *                                 "fail" avec un message d'erreur, si le jeton est invalide.
     *                                 "fail" avec un message d'erreur, si la liste est introuvable.
     *                                 "errors" avec un message d'erreur, en cas d'éch
     */
    public function updateList(int $id, string $csrfToken): string
    {
        try {
            $validToken = $this->csrfToken->isValidToken($csrfToken, "formList");

            if (!$validToken) {
                return json_encode([
                    "status" => "fail",
                    "message" => "no valid csrfToken"
                ]);
            }

            if (!empty($this->user->id)) {
                $model = new Lists();
                $list = $model->getOneListById($id);

                if (empty($list)) {
                    return json_encode([
                        "status" => "fail",
                        "errors" => "no list found"
                    ]);
                }

                $errors = $this->validator->isValidParams($_POST, Validator::CONTEXT_UPDATE_LIST);
                if (empty(count($errors))) {
                    $listId = $list->id;
                    $params = [
                        'type' => $_POST['typeList'],
                        'title' => $_POST['titleList'],
                        'description' => $_POST['descriptionList']
                    ];
                    $model->updateList($params, $listId);
                    return json_encode([
                        "status" => "updateList",
                        "message" => "la liste a bien été mise à jour."
                    ]);
                }
                return json_encode([
                    "status" => "errors",
                    "errors" => $errors
                ]);
            }
            return json_encode([
                "status" => "updateList failed",
                "message" => "no user found"
            ]);
        } catch (\Exception $e) {
            return json_encode([
                "status" => "errors",
                "message" => $e->getMessage()
            ]);
        }
    }

    /**
     * Cette méthode permet la suppression d'une liste d'un utilisateur.
     * @param int $id - L'ID de la liste à supprimer.
     *
     * @return string - Réponse JSON : "deleteList" avec un message, en cas de succès.
     *                                 "deleteList failed" avec un message d'erreur, si l'utilisateur est introuvable.
     *                                 "fail" avec un message d'erreur, si la liste est introuvable.
     *                                 "errors" avec un message d'erreur, en cas d'échec.
     */
    public function deleteList(int $id): string
    {
        try {
            if (!empty($this->user->id)) {
                $model = new Lists();
                $list = $model->getOneListById($id);

                if (!empty($list)) {
                    $model->deleteList($list->id);

                    return json_encode([
                        "status" => "deleteList",
                        "message" => "la liste a bien été supprimée."
                    ]);
                };
                return json_encode([
                    "status" => "fail",
                    "message" => "no list found"
                ]);
            }
            return json_encode([
                "status" => "deleteList failed",
                "message" => "no user found"
            ]);
        } catch (\Exception $e) {
            return json_encode([
                "status" => "errors",
                "message" => $e->getMessage()
            ]);
        };
    }
}
