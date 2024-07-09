<?php

namespace Services;

use Controllers\UserController;
use Controllers\ListController;
use Controllers\CardController;
use Controllers\ReservationController;

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

            switch ($_GET['route']) {
                case 'csrf':
                    if ($this->isAllowedMethod('POST')) {
                        $user = new UserController();
                        echo $user->CSRFToken(); // token
                    }
                    break;

                /**
                 * Route utilisateur
                 */

                case 'user_register':
                    if ($this->isAllowedMethod('POST')) {
                        $user = new UserController();
                        echo $user->register($headers['X-CSRFToken']); // create
                    }
                    break;

                case 'user_login':
                    if ($this->isAllowedMethod('POST')) {
                        $user = new UserController();
                        echo $user->login($headers['X-CSRFToken']);
                    }
                    break;

                case 'user_logout':
                    if ($this->isAllowedMethod('POST')) {
                        $user = new UserController();
                        $headers = getallheaders();
                        echo $user->logout($headers['Authorization']);
                    }
                    break;

                case 'user_profil':
                    if ($this->isAllowedMethod('GET')) {
                        $user = new UserController();
                        $id = $_GET['id'] ?? null;
                        echo $user->readOneUser($headers['Authorization'], $id); // readOne sur profil.html
                    }
                    break;

                case 'user_update':
                    if ($this->isAllowedMethod('POST')) {
                        $user = new UserController();
                        echo $user->update($headers['Authorization'], $headers['X-CSRFToken']); // update
                    }
                    break;

                case 'user_delete':
                    if ($this->isAllowedMethod('POST')) {
                        $user = new UserController();
                        $headers = getallheaders();
                        echo $user->delete($headers['Authorization']); // delete
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
                        echo $user->updateUserById($headers['Authorization'], $headers['X-CSRFToken'], $_POST['id']); // updateUserById
                    }
                    break;

                case 'admin_delete_user':
                    if ($this->isAllowedMethod('POST')) {
                        $user = new UserController();
                        echo $user->deleteById($headers['Authorization'], $_POST['id']); // delete
                    }
                    break;

                /**
                 * Route des listes
                 */

                case 'create_list':
                    if ($this->isAllowedMethod('POST')) {
                        $list = new ListController($headers['Authorization']);
                        echo $list->createList($headers['X-CSRFToken']); // createList
                    }
                    break;

                case 'read_one_list_by_id': // Toutes les listes d'un utilisateur sur list.html
                    if ($this->isAllowedMethod('GET')) {
                        $list = new ListController($headers['Authorization']);
                        echo $list->readOneListById(); // readOneById
                    }
                    break;

                case 'read_all_lists_by_user': // Toutes les listes d'un utilisateur sur lists.html
                    if ($this->isAllowedMethod('GET')) {
                        $id = $_GET['id'] ?? null;
                        $list = new ListController($headers['Authorization']);
                        echo $list->readAllListsByUser($id); // readOneByUser
                    }
                    break;

                case 'read_all_lists_all_users': // Toutes les listes de tous les utilisateurs sur home.html
                    if ($this->isAllowedMethod('GET')) {
                        $list = new ListController($headers['Authorization']);
                        echo $list->readAllListsAllUsers(); // readAllAllUser
                    }
                    break;

                case 'update_list':
                    if ($this->isAllowedMethod('POST')) {
                        $list = new ListController($headers['Authorization']);
                        echo $list->updateList($_POST['id'], $headers['X-CSRFToken']); // updateList
                    }
                    break;

                case 'delete_list':
                    if ($this->isAllowedMethod('POST')) {
                        $list = new ListController($headers['Authorization']);
                        echo $list->deleteList($_POST['id']); // deleteList
                    }
                    break;

                /**
                 * Route des cartes
                 */

                case 'create_card':
                    if ($this->isAllowedMethod('POST')) {
                        $card = new CardController($headers['Authorization']);
                        echo $card->createCard($headers['X-CSRFToken']); // createCard
                    }
                    break;

                case 'update_card':
                    if ($this->isAllowedMethod('POST')) {
                        $card = new CardController($headers['Authorization']);
                        echo $card->updateCard($_POST['id'], $headers['X-CSRFToken']); // updateCard
                    }
                    break;

                case 'delete_card':
                    if ($this->isAllowedMethod('POST')) {
                        $card = new CardController($headers['Authorization']);
                        echo $card->deleteCard($_POST['id']); // deleteCard
                    }
                    break;

                /**
                 * Route des réservations
                 */

                case 'create_reservation':
                    if ($this->isAllowedMethod('POST')) {
                        $reservation = new ReservationController($headers['Authorization']);
                        echo $reservation->createReservation($headers['X-CSRFToken']); // Create reservation
                    }
                    break;

                case 'read_one_reservation_by_id': // Toutes les listes d'un utilisateur sur list.html
                    if ($this->isAllowedMethod('GET')) {
                        $reservation = new ReservationController($headers['Authorization']);
                        echo $reservation->readOneReservationById(); // readOneById
                    }
                    break;

                case 'cancel_reservation':
                    if ($this->isAllowedMethod('POST')) {
                        $reservation = new ReservationController($headers['Authorization']);
                        echo $reservation->cancelReservation($_POST['id']); // cancel reservation
                    }
                    break;

                /**
                 * Route des priorités
                 */

                case 'update_priority':
                    if ($this->isAllowedMethod('POST')) {
                        $card = new CardController($headers['Authorization']);
                        echo $card->updatePriority($_POST['id'], $_POST['priority']); // update priority stars
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
     * Vérifie si une méthode HTTP est autorisée pour la demande en cours.
     *
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
}
