<?php

namespace Services;

use Controllers\UserController;

Class Router
{
    public function routing()
    {
        if(array_key_exists('route', $_GET)): // on vérifie que la route existe dans l'URL
    
            switch ($_GET['route']) {
                case 'user:register':
                    $user = new UserController();
                    echo $user->register();
                    break;

                case 'user:login':
                    $user = new UserController();
                    echo $user->login();
                    break;

                case 'user:update':
                    $user = new UserController();
                    echo $user->update();
                    break;

                case 'user:loggout':
                    $user = new UserController();
                    echo $user->loggout();
                    break;

                default:
                header('Location: index.php?route=home'); // pas d'espace avant les deux points
                exit;
                break;
            }
        else: 
            header('Location: index.php?route=home'); // on renvoie vers l'index
            exit;
        endif;    
    }
}
