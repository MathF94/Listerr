<?php

namespace Services;

use Controllers\UserController;

Class Router
{
    public function routing()
    {
        if(array_key_exists('route', $_GET)): // on vérifie que la route existe dans l'URL
    
            switch ($_GET['route']) {                
                case 'user:index':
                    $user = new UserController();
                    echo $user->index();
                    break;
                    
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
                    echo $user->logout(); // delete
                    break;

                default:
                header('Location: index.php'); // on renvoie vers l'index
                exit;
                break;
            }
        else: 
            header('Location: index.php'); // on renvoie vers l'index
            exit;
        endif;    
    }
}
