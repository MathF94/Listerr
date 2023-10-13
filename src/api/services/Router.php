<?php

namespace Services;

use Controllers\UserController;
use Controllers\ListController;

class Router
{
    public function routing(): void
    {
        if (array_key_exists('route', $_GET)) : // on vérifie que la route existe dans l'URL

            switch ($_GET['route']) {
                case 'user_register':
                    if ($this->isAllowedMethod('POST')) {
                        $user = new UserController();
                        echo $user->register(); // create
                    }
                    break;

                case 'user_login':
                    if ($this->isAllowedMethod('POST')) {
                        $user = new UserController();
                        echo $user->login();
                    }
                    break;

                case 'user_logout':
                    if ($this->isAllowedMethod('GET')) {
                        $user = new UserController();
                        $headers = getallheaders();
                        echo $user->logout($headers['Authorization']);
                    }
                    break;

                case 'user_profil':
                    if ($this->isAllowedMethod('GET')) {
                        $user = new UserController();
                        $headers = getallheaders();
                        echo $user->read($headers['Authorization']); // readOne
                    }
                    break;

                case 'user_update':
                    if ($this->isAllowedMethod('POST')) {
                        $user = new UserController();
                        $headers = getallheaders();
                        echo $user->update($headers['Authorization']); // update
                    }
                    break;

                case 'user_delete':
                    if ($this->isAllowedMethod('GET')) {
                        $user = new UserController();
                        $headers = getallheaders();
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
                        $list = new ListController();
                        $headers = getallheaders();
                        echo $list->create($headers['Authorization']); // create
                    }
                    break;

                case 'read_list': // pour l'utilisateur
                    if ($this->isAllowedMethod('GET')) {
                        $list = new ListController();
                        $headers = getallheaders();
                        echo $list->readListByUser($headers['Authorization']); // readOne
                    }
                    break;

                case 'read_all_lists': // pour l'admin
                    if ($this->isAllowedMethod('GET')) {
                        $list = new ListController();
                        $headers = getallheaders();
                        echo $list->readAll($headers['Authorization']); // readAll
                    }
                    break;

                case 'update_list':
                    if ($this->isAllowedMethod('POST')) {
                        // $list = new ListController();
                        // echo $list->update(); // update
                    }
                    break;

                case 'delete_list':
                    if ($this->isAllowedMethod('GET')) {
                        // $list = new ListController();
                        // echo $list->delete(); // delete
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
