<?php

namespace Controllers;

use Models\Reservations;
use Models\Lists;
use Models\Cards;
use Models\Users;
use Services\CSRFToken;
use Services\SendMail;
use Services\Session;
use Services\Validator;

use function Ramsey\Uuid\v1;

/**
 * Classe représentant un objet d'une carte.
 */
class ReservationController
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
        if ($tokenUser === 'null') {
            $session = new Session();
            $id = 0;
            $login = "Guest";
            $password = bin2hex(random_bytes(24));
            $tokenUser = $session->encrypt($id, $login, $password);
        }

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
     * Cette méthode permet la création d'une nouvelle réservation, après validation du jeton CSRF.
     *
     * @param string $csrfToken - Jeton CSRF pour valider la requête.
     *
     * @return string - Réponse JSON : "createReservation" avec un message, en cas de succès.
     *                                 "createReservation failed" avec un message d'erreur, si l'utilisateur est introuvable.
     *                                 "fail" avec un message d'erreur, si le jeton est invalide.
     *                                 "errors" avec un message d'erreur, en cas d'échec.
     */
    public function createReservation(string $csrfToken): string
    {
        try {
            $validToken = $this->csrfToken->isValidToken($csrfToken, "formGuest");
            if (!$validToken) {
                return json_encode([
                    "status" => "fail",
                    "message" => "no valid csrfToken"
                ]);
            }

            $errors = $this->validator->isValidParams($_POST, Validator::CONTEXT_CREATE_RESERVATION);
            if (empty(count($errors))) {
                $params = [
                    'name' => $_POST['name'],
                    'email' => $_POST['email'],
                    'list_id' => (int)$_POST['list_id'],
                    'card_id' => (int)$_POST['card_id']
                ];

                $sendMail = $this->getElementMailReservation($params);
                if ($sendMail) {
                    return json_encode([
                        "status" => "createReservation",
                        "message" => "la réservation a bien été créée et le mail envoyé."
                    ]);
                }
            }
            return json_encode([
                "status" => "errors",
                "errors" => $errors
            ]);

        } catch (\Exception $e) {
            return json_encode([
                "status" => "errors",
                "message" => $e->getMessage()
            ]);
        }
    }

    /**
     * Cette méthode récupère en fonction de l'ID de la réservation, sur la page list.html :
     *       ==> les détails d'une seul liste,
     *                       de l'utilisateur,
     *                       des cartes associés à la liste,
     *                       des réservations associées à la carte.
     *
     * @return string - Réponse JSON : "readOneReservation" avec les data d'une réservation, en cas de succès.
     *                                 "readOneReservation failed" avec un message d'erreur, si l'ID est vide.
     *                                 "fail" avec un message d'erreur, si la réservation est introuvable.
     *                                 "errors" avec un message d'erreur, en cas d'échec.
     */
    public function readOneReservationById(): string
    {
        try {
            if (!empty($_GET['id']) && is_numeric($_GET['id'])) {
                $id = (int)$_GET['id'];

                $modelReservation = new Reservations();
                $reservation = $modelReservation->getOneReservationById($id);

                if (empty($reservation)) {
                    return json_encode([
                        "status" => "in pending reservation",
                        "message" => "no reservation found"
                    ]);
                }

                $url = $_SERVER['HTTP_REFERER'];
                $query = parse_url($url, PHP_URL_QUERY);
                parse_str($query, $params);

                if (!array_key_exists('GuestToken', $params)) {
                    return json_encode([
                        "status" => "readOneReservation",
                        "dataReservation" => $reservation
                    ]);

                } else {
                    $dataToDecrypt = $params['GuestToken'];
                    $guestToken = str_replace(' ', '+', $dataToDecrypt);

                    $session = new Session();
                    $decryptGuestToken = $session->decrypt("$guestToken");

                    return json_encode([
                        "status" => "readOneReservation",
                        "dataReservation" => $reservation,
                        "decryptGuestToken" => ['label' => 'decryptGuestToken', 'value' => $decryptGuestToken]
                    ]);
                }
            }

            return json_encode([
                "status" => "readOneReservation failed",
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
     * Cette méthode permet la suppression d'une réservation d'une liste.
     * @param int $id - L'ID de la carte où il y a la réservation à annuler.
     *
     * @return string - Réponse JSON : "CancelledReservation" avec un message, en cas de succès.
     *                                 "CancelledReservation failed" avec un message d'erreur, si l'utilisateur est introuvable.
     *                                 "fail" avec un message d'erreur, si la réservation est introuvable.
     *                                 "errors" avec un message d'erreur, en cas d'échec.
     */
    public function cancelReservation(int $id): string
    {
        try {
            if (!empty($this->user->id) || empty($this->user)) {
                // Récupération de l'ID de la réservation
                $model = new Reservations();
                $reservation = $model->getOneReservationById($id);

                if (!empty($reservation)) {
                    $model->cancelReservation($reservation->id);

                    return json_encode([
                        "status" => "CancelledReservation",
                        "message" => "la réservation a bien été annulée."
                    ]);
                }
                return json_encode([
                    "status" => "fail",
                    "message" => "no reservation found"
                ]);
            }

            return json_encode([
                "status" => "CancelledReservation failed",
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
     * Cette méthode permet de récupérer les éléments pour construire la notification par mail
     * (nom de propriétaire de liste, nom de la liste, nom du souhait / tâche)
     *
     * @param array $params - Tableau contenant les informations nécessaires :
     *                      - 'list_id' (int) : L'identifiant de la liste.
     *                      - 'card_id' (int) : L'identifiant de la tâche/carte.
     *                      - Autres paramètres requis pour la création d'une réservation.
     *
     * @return bool - Vrai si mail envoyé
     * @return bool - Faux si mail pas envoyé
     * @return string - Réponse JSON : "errors" avec un message d'erreur, en cas d'échec.
     *
     */
    public function getElementMailReservation($params): mixed
    {
        try {
            $modelSendMails = new SendMail();

            $session = new Session();
            $encryptGuestToken = $session->encryptGuestToken($params['name'], $params['email'], $params['list_id'], $params['card_id']);

            $modelReservations = new Reservations();
            $modelReservations->createReservation($params);

            $modelLists = new Lists();
            $lists = $modelLists->getOneListById($params['list_id']);

            $modelCards = new Cards();
            $cards = $modelCards->getOneCardById($params['card_id']);

            $recipient = $_POST['email'];
            $listUserLogin = $lists->user->login;
            $listTitle = $lists->title;
            $cardTitle = $cards->title;

            $subject = 'Votre réservation a bien été pris en compte sur Listerr';
            $message = '
                <p>Bonjour ' . htmlspecialchars($_POST['name']) . ',</p>' .
                '<p>Nous vous confirmons avoir bien pris en compte la réservation de ' . htmlspecialchars($cardTitle) . ' dans la liste ' . htmlspecialchars($listTitle) . ' de ' . htmlspecialchars($listUserLogin) . ' sur Listerr.</p>' .
                '<p>Si vous souhaitez retrouver votre réservation, merci de cliquer sur le lien ci-dessous :</p>' .
                '<p><a href="http://localhost/listerr/src/app/src/list/pages/list.html?id=' . urlencode($_POST['list_id']) . '&GuestToken=' . urlencode($encryptGuestToken) . '">Lien pour l\'annulation</a></p>' .
                '<p>Toute l\'équipe de Listerr vous remercie et vous souhaite une bonne journée.</p>' .
                '<p>Cordialement.</p>' .
                '<p>Administrateur de Listerr.
                ';

                // http://localhost/listerr/src/app/src/list/pages/  https://listerr.tea-tux.fr/list/pages/ ==> pour les tests

            if ($modelSendMails->sendReservationMail($recipient, $subject, $message, $listUserLogin, $listTitle, $cardTitle)) {
                return true;
            } else {
                return false;
            }

        } catch (\Exception $e) {
            return json_encode([
                "status" => "errors",
                "message" => $e->getMessage()
            ]);
        }
    }
}