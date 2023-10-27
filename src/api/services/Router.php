<?php

namespace Services;

use Controllers\UserController;
use Controllers\ListController;

class Router
{
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
                        echo $user->logout($headers['Authorization']);
                    }
                    break;

                case 'user_profil':
                    if ($this->isAllowedMethod('GET')) {
                        $user = new UserController();
                        echo $user->read($headers['Authorization']); // readOne
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
                        echo $user->delete($headers['Authorization']); // delete
                    }
                    break;

                case 'admin_read_users':
                    if ($this->isAllowedMethod('GET')) {
                        $user = new UserController();
                        echo $user->readUsers(); // readAll
                    }
                    break;

                    // @TODO
                    // case 'admin_update_user':
                    //     if ($this->isAllowedMethod('GET')) {
                    //         $user = new UserController();
                    //         echo $user->update($headers['Authorization']); // update
                    //     }
                    //     break;

                    // case 'admin_delete_user':
                    //     if ($this->isAllowedMethod('GET')) {
                    //         $user = new UserController();
                    //         echo $user->delete($headers['Authorization']); // delete
                    //     }
                    //     break;

                case 'create_list':
                    if ($this->isAllowedMethod('POST')) {
                        $list = new ListController($headers['Authorization']);
                        echo $list->create(); // create
                    }
                    break;

                case 'read_one_list_by_id': // Toutes les listes d'un utilisateur sur lists.html
                    if ($this->isAllowedMethod('GET')) {
                        $list = new ListController($headers['Authorization']);
                        echo $list->readOneListById(); // readOne
                    }
                    break;

                case 'read_lists_one_user': // Toutes les listes d'un utilisateur sur lists.html
                    if ($this->isAllowedMethod('GET')) {
                        $list = new ListController($headers['Authorization']);
                        echo $list->readListsOneUser(); // readOne
                    }
                    break;

                case 'read_all_by_users': // Toutes les listes de tous les utilisateurs sur home.html
                    if ($this->isAllowedMethod('GET')) {
                        $list = new ListController($headers['Authorization']);
                        echo $list->readAllByUsers(); // readAll
                    }
                    break;

                case 'update_list':
                    if ($this->isAllowedMethod('POST')) {
                        $list = new ListController($headers['Authorization']);
                        echo $list->updateList($headers['id']); // update
                    }
                    break;

                case 'delete_list':
                    if ($this->isAllowedMethod('POST')) {
                        $list = new ListController($headers['Authorization']);
                        echo $list->deleteList($headers['id']); // delete
                    }
                    break;

                    // case 'create_card':
                    //     if ($this->isAllowedMethod('POST')) {
                    //         // $card = new CardController();
                    //         // echo $card->create(); // create
                    //     }
                    //     break;

                    // case 'read_card':
                    //     if ($this->isAllowedMethod('GET')) {
                    //         // $user = new CardController();
                    //         // echo $card->read(); // readOne
                    //     }
                    //     break;

                    // case 'update_card':
                    //     if ($this->isAllowedMethod('POST')) {
                    //         // $card = new CardController();
                    //         // echo $card->update(); // update
                    //     }
                    //     break;

                    // case 'delete_card':
                    //     if ($this->isAllowedMethod('GET')) {
                    //         // $card = new CardController();
                    //         // echo $card->delete(); // delete
                    //     }
                    //     break;

                default:
                    header('Location: index.php'); // on renvoie vers l'index
                    exit;
                    break;
            }
        else :
            header('Location: index.php'); // on renvoie vers l'index
            exit;

        endif;
    }

    private function isAllowedMethod($method): bool
    {
        //$_SERVER['REQUEST_METHOD'] retourne get, post, pull, update, delete, selon la méthode de la requête utilisée
        if ($method !== $_SERVER['REQUEST_METHOD']) {
            echo json_encode(['statusCode' => 403, 'message' => 'Method not allowed']);
            return false;
        }
        return true;
    }
}
