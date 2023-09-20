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
                    $user = new UserController();
                    echo $user->register(); // create
                    break;

                case 'user_login':
                    $user = new UserController();
                    echo $user->login(); // readOne
                    break;

                case 'user_display':
                    $user = new UserController();
                    echo $user->display(); // readAll
                    break;

                case 'user_update':
                    $user = new UserController();
                    echo $user->update(); // update
                    break;

                case 'user_logout':
                    $user = new UserController();
                    echo $user->logout($_POST['token_user']); // delete
                    break;

                case 'list_index':
                    $list = new ListController();
                    echo $list->index();
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
}
