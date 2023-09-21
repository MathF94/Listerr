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
                        echo $user->login(); // readOne
                    }
                    break;

                case 'user_display':
                    if ($this->isAllowedMethod('GET')) {
                        $user = new UserController();
                        $headers = getallheaders();
                        echo $user->display($headers['Authorization']); // readAll
                    }
                    break;

                case 'user_update':
                    if ($this->isAllowedMethod('POST')) {
                        $user = new UserController();
                        echo $user->update(); // update
                    }
                    break;

                case 'user_logout':
                    if ($this->isAllowedMethod('POST')) {
                        $user = new UserController();
                        echo $user->logout($_POST['tokenUser']); // delete
                    }
                    break;

                case 'list_index':
                    if ($this->isAllowedMethod('GET')) {
                        $list = new ListController();
                        echo $list->index();
                    }
                    break;

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
