<?php

namespace Controllers;

use Models\Cards;
use Models\Users;
use Services\CSRFToken;
use Services\SendMail;
use Services\Session;
use Services\Validator;

/**
 * Classe représentant un objet d'une carte.
 */
class CardController
{
    private $csrfToken;
    private $validator;
    private $user;

    /**
     * Constructeur de la classe CardController.
     *
     * Ce constructeur initialise les dépendances nécessaires et authentifie un utilisateur, en utilisant un jeton fourni.
     * Il est appelé lors de la création d'une instance de CardController.
     *
     * $tokenUser peut être à null dans le cas d'un partage de liste vers un utilisateur visiteur, non connecté à l'application,
     * dans le cas d'une réservation d'une carte appartenant à une WishList uniquement.
     *
     * @param string $tokenUser - Le jeton d'utilisateur utilisé pour l'authentification.
     */
    public function __construct($tokenUser = null)
    {
        if ($tokenUser !== null) {
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
    }

    /**
     * Aide au chiffrement du jeton CSRF en réponse à une requête.
     *
     * Cette méthode récupère le champ "formId" du $_POST, qui correspond à l'ID du formulaire renvoyé via le CSRFToken.js,
     *               chiffre cette valeur et l'envoie en paramètre de la méthode encrypt() pour générer un CSRF Token.
     *
     * @return string - Réponse JSON : "csrfTokenEncrypted" avec le jeton CSRF chiffré, en cas de succès.
     *                                 "fail" avec un message d'erreur, en cas d'échec.
     */
    public function CSRFToken(): string
    {
        try {
            $formId = $_POST["formId"];
            $encryptedCSRFToken = $this->csrfToken->encrypt($formId);
            return json_encode([
                "status" => "success",
                "csrfToken" => $encryptedCSRFToken,
            ]);

            return json_encode([
                "status" => "fail",
                "errors" => "error encrypted csrfToken"
            ]);
        } catch (\Exception $e) {
            return json_encode([
                "status" => "error",
                "message" => $e->getMessage()
            ]);
        }
    }

    /**
     * Cette méthode permet la création d'une nouvelle carte, après validation du jeton CSRF.
     *
     * @param string $csrfToken - Jeton CSRF pour valider la requête.
     *
     * @return string - Réponse JSON : "createCard" avec un message, en cas de succès.
     *                                 "createCard failed" avec un message d'erreur, si l'utilisateur est introuvable.
     *                                 "fail" avec un message d'erreur, si le jeton est invalide.
     *                                 "errors" avec un message d'erreur, en cas d'échec.
     */
    public function createCard(string $csrfToken): string
    {
        try {
            $validToken = $this->csrfToken->isValidToken($csrfToken, "formCard");

            if (!$validToken) {
                return json_encode([
                    "status" => "fail",
                    "message" => "no valid csrfToken"
                ]);
            }

            if (!empty($this->user)) {
                $errors = $this->validator->isValidParams($_POST, Validator::CONTEXT_CREATE_CARD);

                if (empty(count($errors))) {
                    $params = $_POST;
                    $model = new Cards();
                    $create = $model->createCard($params);

                    $sendMail = new SendMail();
                    $mail = $sendMail->getElementMailCard($params);

                    if ($create && $mail) {
                        return json_encode([
                            "status" => "createCard",
                            "message" => "la carte a bien été créée."
                        ]);
                    }
                }
                return json_encode([
                    "status" => "errors",
                    "errors" => $errors
                ]);
            }
            return json_encode([
                "status" => "createCard failed",
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
     * La méthode getAllCardsByList() (équivalent du ReadAll) est appelée dans l'entity Lister afin qu'elle récupère les informations des listes.
     */

    /**
     * Cette méthode permet la mise à jour des informations d'une carte, après validation du jeton CSRF.
     * @param int $id - L'ID de la carte à mettre à jour.
     * @param string $csrfToken - Jeton CSRF pour valider la requête.
     *
     * @return string - Réponse JSON : "updateCard" avec un message, en cas de succès.
     *                                 "updateCard failed" avec un message d'erreur, si l'utilisateur est introuvable.
     *                                 "fail" avec un message d'erreur, si le jeton est invalide.
     *                                 "fail" avec un message d'erreur, si la carte est introuvable.
     *                                 "errors" avec un message d'erreur, en cas d'échec.
     */
    public function updateCard(int $id, string $csrfToken): string
    {
        try {
            $validToken = $this->csrfToken->isValidToken($csrfToken, "formCard");

            if (!$validToken) {
                return json_encode([
                    "status" => "fail",
                    "message" => "no valid csrfToken"
                ]);
            }

            if (!empty($this->user->id)) {
                $model = new Cards();
                $card = $model->getOneCardById($id);


                if (empty($card)) {
                    return json_encode([
                        "status" => "fail",
                        "errors" => "no card found"
                    ]);
                }

                $errors = $this->validator->isValidParams($_POST, Validator::CONTEXT_UPDATE_CARD);
                if (empty(count($errors))) {
                    $params = [
                        "title" => $_POST["titleCard"],
                        "description" => $_POST["descriptionCard"],
                        "priority" => (int)$_POST["priority"]
                    ];

                    $model->updateCard($params, $card->id);

                    return json_encode([
                        "status" => "updateCard",
                        "message" => "la carte a bien été mise à jour."
                    ]);
                }

                return json_encode([
                    "status" => "errors",
                    "errors" => $errors
                ]);
            }
            return json_encode([
                "status" => "updateCard failed",
                "message" => "no user found"
            ]);
        } catch (\Exception $e) {
            return json_encode([
                "status" => "errors",
                "message" => $e->getMessage()
            ]);
        }
    }

    public function updatePriority(int $id, string $priority): string
    {
        try {
            if (!empty($this->user->id)) {
                $model = new Cards();
                $card = $model->getOneCardById($id);

                if (empty($card)) {
                    return json_encode([
                        "status" => "fail",
                        "errors" => "no card found"
                    ]);
                }

                $params = ["priority" => $priority];
                $model->updatePriority($params, $card->id);

                return json_encode([
                    "status" => "updatePriority",
                    "message" => "la priorité a bien été mise à jour."
                ]);
            }

        } catch (\Exception $e) {
            return json_encode([
                "status" => "errors",
                "message" => $e->getMessage()
            ]);
        }
    }

    /**
     * Cette méthode permet la suppression d'une carte d'une carte.
     * @param int $id - L'ID de la carte à supprimer.
     *
     * @return string - Réponse JSON : "deletedCard" avec un message, en cas de succès.
     *                                 "deletedCard failed" avec un message d'erreur, si l'utilisateur est introuvable.
     *                                 "fail" avec un message d'erreur, si la carte est introuvable.
     *                                 "errors" avec un message d'erreur, en cas d'échec.
     */
    public function deleteCard(int $id): string
    {
        try {
            if (!empty($this->user->id)) {
                $model = new Cards();
                $card = $model->getOneCardById($id);

                if (!empty($card)) {
                    $model->deleteCard($card->id);

                    return json_encode([
                        "status" => "deleteCard",
                        "message" => "la carte a bien été supprimée."
                    ]);
                }
                return json_encode([
                    "status" => "fail",
                    "message" => "no card found"
                ]);
            }
            return json_encode([
                "status" => "deleteCard failed",
                "message" => "no user found"
            ]);
        } catch (\Exception $e) {
            return json_encode([
                "status" => "errors",
                "message" => $e->getMessage()
            ]);
        }
    }

    public function deleteAllCards(): string
    {
        try {
            if (!empty($this->user->id)) {
                $model = new Cards();
                $model->deleteAllCards();

                return json_encode([
                    "status" => "deleteCard",
                    "message" => "la carte a bien été supprimée."
                ]);
            }
            return json_encode([
                "status" => "fail",
                "message" => "no card found"
            ]);

        } catch (\Exception $e) {
            return json_encode([
                "status" => "errors",
                "message" => $e->getMessage()
            ]);
        }
    }
}
