<?php

namespace Controllers;

use Entity\Card;
use Models\Cards;
use Models\Lists;
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
    private $list;

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

    public function create($csrfToken): string
    {
        try {
            $validToken = $this->csrfToken->isValidToken($csrfToken, "createFormCard");

            if (!$validToken) {
                return json_encode([
                    'status' => 'fail',
                    'message' => 'jeton invalide'
                ]);
            }

            if (!empty($this->user)) {
                $errors = $this->validator->isValidParams($_POST, Validator::CONTEXT_CREATE_CARD);

                if (empty(count($errors))) {
                    $params = $_POST;
                    $model = new Cards();
                    $model->create($params);

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

    public function readOneCard(int $id): string
    {
        try {
            if (!empty($this->user->id)) {
                $model = new Cards();
                $card = $model->getOneCardById($id);

                if (!empty($card)) {
                    return json_encode([
                        'status' => 'readOne',
                        'message' => $card
                    ]);
                };
                return json_encode([
                    'status' => 'fail',
                    'message' => 'no card'
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
     * Cette méthode permet la mise à jour des informations d'une carte d'une liste, après validation du jeton CSRF.
     *
     * @return string - Réponse JSON contenant un message de validaiton de mise à jour ou un message d'erreur.
     */
    public function updateCard(int $id, string $csrfToken): string
    {
        try {
            $validToken = $this->csrfToken->isValidToken($csrfToken, "updateFormCard");

            if (!$validToken) {
                return json_encode([
                    'status' => 'fail',
                    'message' => 'jeton invalide'
                ]);
            }

            if (!empty($this->user->id)) {
                $model = new Cards();
                $card = $model->getOneCardById($id);

                $errors = $this->validator->isValidParams($_POST, Validator::CONTEXT_UPDATE_CARD);
                if (empty(count($errors))) {
                    $cardId = $card->id;

                    $params = [
                        'title' => $_POST['title'],
                        'description' => $_POST['description'],
                        'priority' => $_POST['priority'],
                        'checked'=> $_POST['checked']
                    ];
                }

                $model->update($params, $cardId);

                return json_encode([
                    'status' => 'updated',
                    'message' => 'la carte a bien été mise à jour.'
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

    /**
     * Cette méthode récupère la suppression d'une carte d'une liste.
     * @param int $id - L'ID de la carte à supprimer.
     * @return string - Réponse JSON contenant un message de succès ou un message d'erreur.
     */
    public function deleteCard(int $id): string
    {
        try {
            if (!empty($this->user->id)) {
                $model = new Cards();
                $card = $model->getOneCardById($id);

                if (!empty($card)) {
                    $model->delete($card->id);

                    return json_encode([
                        'status' => 'deleted',
                        'message' => 'la carte a bien été supprimée.'
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
