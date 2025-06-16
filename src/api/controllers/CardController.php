<?php

/*
 * listerr - gestionnaire de listes et tâches
 * Copyright (C) 2025 Mathieu Fagot
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

namespace Controllers;

use Models\Cards;
use Models\Users;
use Services\CSRFToken;
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

                    if ($create) {
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
            return json_encode([
                "status" => "updatePriority failed",
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
     * Cette méthode permet la suppression d'une carte d'une liste.
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
