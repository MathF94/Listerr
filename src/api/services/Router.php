<?php

namespace Services;

use Controllers\CardController;
use Controllers\FeatureController;
use Controllers\ListController;
use Controllers\ReservationController;
use Controllers\UserController;
use Services\CSRFToken;
use Services\SendMail;

/**
 * Classe pour le routage des demandes HTTP vers les contrôleurs appropriés.
 */
class Router
{
    /**
     * Effectue le routage des demandes HTTP vers les contrôleurs correspondants.
     */
    public function routing(): void
    {
        if (array_key_exists('route', $_GET)) : // on vérifie que la route existe dans l'URL
            $headers = getallheaders();
            $csrfToken = $this->getCsrfToken($headers);

            switch ($_GET['route']) {
                case 'csrf':
                    if ($this->isAllowedMethod('POST')) {
                        $csrfToken = new CSRFToken();
                        echo $csrfToken->CSRFToken(); // token
                    }
                    break;

                /**
                 * Route utilisateur
                 */

                case 'user_register':
                    if ($this->isAllowedMethod('POST')) {
                        $user = new UserController();
                        echo $user->register($csrfToken); // create
                    }
                    break;

                case 'user_login':
                    if ($this->isAllowedMethod('POST')) {
                        $user = new UserController();
                        echo $user->login($csrfToken);
                    }
                    break;

                case 'user_logout':
                    if ($this->isAllowedMethod('POST')) {
                        $user = new UserController();
                        $headers = getallheaders();
                        echo $user->logout($headers['X-Authorization']);
                    }
                    break;

                case 'user_profil':
                    if ($this->isAllowedMethod('GET')) {
                        $user = new UserController();
                        $id = $_GET['id'] ?? null;
                        echo $user->readOneUser($headers['X-Authorization'], $id); // readOne sur profil.html
                    }
                    break;

                case 'user_update':
                    if ($this->isAllowedMethod('POST')) {
                        $user = new UserController();
                        echo $user->update($headers['X-Authorization'], $csrfToken); // update
                    }
                    break;

                case 'user_delete':
                    if ($this->isAllowedMethod('POST')) {
                        $user = new UserController();
                        $headers = getallheaders();
                        echo $user->delete($headers['X-Authorization']); // delete
                    }
                    break;

                /**
                 * Route de gestion utilisateur par Admin
                 */

                case 'admin_read_users':
                    if ($this->isAllowedMethod('GET')) {
                        $user = new UserController();
                        echo $user->readAllUsers(); // readAll sur profils.html
                    }
                    break;

                case 'admin_update_user':
                    if ($this->isAllowedMethod('POST')) {
                        $user = new UserController();
                        echo $user->updateUserById($headers['X-Authorization'], $csrfToken, $_POST['id']); // updateUserById
                    }
                    break;

                case 'admin_delete_user':
                    if ($this->isAllowedMethod('POST')) {
                        $user = new UserController();
                        echo $user->deleteById($headers['X-Authorization'], $_POST['id']); // delete
                    }
                    break;

                /**
                 * Route des listes
                 */

                case 'create_list':
                    if ($this->isAllowedMethod('POST')) {
                        $list = new ListController($headers['X-Authorization']);
                        echo $list->createList($csrfToken); // createList
                    }
                    break;

                case 'read_one_list_by_id': // Toutes les listes d'un utilisateur sur list.html
                    if ($this->isAllowedMethod('GET')) {
                        $list = new ListController($headers['X-Authorization']);
                        echo $list->readOneListById(); // readOneById
                    }
                    break;

                case 'read_all_lists_by_user': // Toutes les listes d'un utilisateur sur lists.html
                    if ($this->isAllowedMethod('GET')) {
                        $id = $_GET['id'] ?? null;
                        $list = new ListController($headers['X-Authorization']);
                        echo $list->readAllListsByUser($id); // readOneByUser
                    }
                    break;

                case 'read_all_lists_all_users': // Toutes les listes de tous les utilisateurs sur home.html
                    if ($this->isAllowedMethod('GET')) {
                        $list = new ListController($headers['X-Authorization']);
                        echo $list->readAllListsAllUsers(); // readAllAllUser
                    }
                    break;

                case 'update_list':
                    if ($this->isAllowedMethod('POST')) {
                        $list = new ListController($headers['X-Authorization']);
                        echo $list->updateList($_POST['id'], $csrfToken); // updateList
                    }
                    break;

                case 'delete_list':
                    if ($this->isAllowedMethod('POST')) {
                        $list = new ListController($headers['X-Authorization']);
                        echo $list->deleteList($_POST['id']); // deleteList
                    }
                    break;

                /**
                 * Route des cartes
                 */

                case 'create_card':
                    if ($this->isAllowedMethod('POST')) {
                        $card = new CardController($headers['X-Authorization']);
                        echo $card->createCard($csrfToken); // createCard
                    }
                    break;

                case 'update_card':
                    if ($this->isAllowedMethod('POST')) {
                        $card = new CardController($headers['X-Authorization']);
                        echo $card->updateCard($_POST['id'], $csrfToken); // updateCard
                    }
                    break;

                case 'delete_card':
                    if ($this->isAllowedMethod('POST')) {
                        $card = new CardController($headers['X-Authorization']);
                        echo $card->deleteCard($_POST['id']); // deleteCard
                    }
                    break;

                case 'delete_all_cards':
                    if ($this->isAllowedMethod('POST')) {
                        $card = new CardController($headers['X-Authorization']);
                        echo $card->deleteAllCards($_POST['id']); // deleteAllCards
                    }
                    break;

                /**
                 * Route des priorités
                 */

                case 'update_priority':
                    if ($this->isAllowedMethod('POST')) {
                        $card = new CardController($headers['X-Authorization']);
                        echo $card->updatePriority($_POST['id'], $_POST['priority']); // update priority stars
                    }
                    break;

                /**
                 * Route des réservations
                 */

                case 'create_reservation':
                    if ($this->isAllowedMethod('POST')) {
                        $reservation = new ReservationController($headers['X-Authorization']);
                        echo $reservation->createReservation($csrfToken); // Create reservation
                    }
                    break;

                case 'read_one_reservation_by_id': // Toutes les listes d'un utilisateur sur list.html
                    if ($this->isAllowedMethod('GET')) {
                        $reservation = new ReservationController($headers['X-Authorization']);
                        echo $reservation->readOneReservationById(); // readOneById
                    }
                    break;

                case 'cancel_reservation':
                    if ($this->isAllowedMethod('POST')) {
                        $reservation = new ReservationController($headers['X-Authorization']);
                        echo $reservation->cancelReservation($_POST['id']); // cancel reservation
                    }
                    break;

                /**
                 * Route de gestion des features par Admin
                 */

                case 'create_feature':
                    if ($this->isAllowedMethod('POST')) {
                        $feature = new FeatureController($headers['X-Authorization']);
                        echo $feature->createFeature($csrfToken); // Create feature
                    }
                    break;

                case 'read_all_features':
                    if ($this->isAllowedMethod('GET')) {
                        $feature = new FeatureController($headers['X-Authorization']);
                        echo $feature->readAllFeatures(); // readAllFeatures sur features.html
                    }
                    break;

                case 'update_feature':
                    if ($this->isAllowedMethod('POST')) {
                        $feature = new FeatureController($headers['X-Authorization']);
                        echo $feature->updateFeature($_POST['id'], $csrfToken); // update sur features.html
                    }
                    break;

                case 'update_status_feature':
                    if ($this->isAllowedMethod('POST')) {
                        $feature = new FeatureController($headers['X-Authorization']);
                        echo $feature->updateStatusFeature($_POST['id']); // update sur features.html
                    }
                    break;

                case 'delete_feature':
                    if ($this->isAllowedMethod('POST')) {
                        $card = new FeatureController($headers['X-Authorization']);
                        echo $card->deleteFeature($_POST['id']); // deleteCard
                    }
                    break;

                /**
                 * Route de gestion d'envoi de mail
                 */

                case 'send_mail_card':
                    if ($this->isAllowedMethod('POST')) {
                        $sendMail = new SendMail($headers['X-Authorization']);
                        echo $sendMail->getElementMailCard($csrfToken, $_POST['listId'], $_POST['recipients'], $_POST['objectMail'], $_POST['descriptionMail']); // Send mail card
                    }
                    break;

                case 'send_mail_feature':
                    if ($this->isAllowedMethod('POST')) {
                        $sendMail = new SendMail($headers['X-Authorization']);
                        echo $sendMail->getElementMailFeature($csrfToken, $_POST['recipients'], $_POST['objectMail'], $_POST['descriptionMail']); // Send mail feature
                    }
                    break;

                default:
                    header('Location: index.php'); // on renvoie vers l'index
                    break;
            }
        else :
            header('Location: index.php'); // on renvoie vers l'index
            exit;
        endif;
    }

    /**
     * Vérifie si une méthode HTTP est autorisée pour la demande en cours.     *
     * @param string $method La méthode HTTP à vérifier (GET, POST, etc.).
     * @return bool Vrai si la méthode est autorisée, sinon faux.
     */
    private function isAllowedMethod($method): bool
    {
        if ($method !== $_SERVER['REQUEST_METHOD']) {
            echo json_encode(['statusCode' => 403, 'message' => 'Method not allowed']);
            return false;
        }
        return true;
    }

    /**
     * Retourne le CSRFToken depuis les headers de requête
     * @param array $header les entêtes de requête
     * @return string le token
     */
    private function getCsrfToken(array $headers): string
    {
        if(array_key_exists('X-CSRFToken', $headers)) {
            return $headers['X-CSRFToken'];
        }

        if(array_key_exists('X-Csrftoken', $headers)) {
            return $headers['X-Csrftoken'];
        }

        return '';
    }
}
