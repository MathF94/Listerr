<?php

namespace Services;

use Controllers\UserController;
use Controllers\WishController;
use Controllers\TodoController;

class Router
{
    public function routing(): void
    {
        if (array_key_exists('route', $_GET)) : // on vérifie que la route existe dans l'URL

            switch ($_GET['route']) {
                case 'user:register':
                    $user = new UserController();
                    echo $user->register(); // create
                    break;

                case 'user:login':
                    $user = new UserController();
                    echo $user->login(); // readOne
                    break;

                case 'user:display':
                    $user = new UserController();
                    echo $user->display(); // readAll
                    break;

                case 'user:update':
                    $user = new UserController();
                    echo $user->update(); // update
                    break;

                case 'user:logout':
                    $user = new UserController();
                    echo $user->logout($_POST['token_user']); // delete
                    break;

                case 'wish:index':
                    $wish = new WishController();
                    echo $wish->index();
                    break;

                case 'user:logout':
                    $todo = new TodoController();
                    echo $todo->index();
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
