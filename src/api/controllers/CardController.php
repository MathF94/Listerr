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

    
}