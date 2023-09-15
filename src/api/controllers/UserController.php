<?php

namespace Controllers;

use Models\Users;
use Models\Sessions;
use Services\Session;
Class UserController 
{    
    public function index(): bool
    {
        return json_encode([
            'connected'=>Session::isActive(),
            'session'=>$_SESSION
        ]);
    }

    public function register(): string
    {
        try {
            $params = $_POST;

            if (!empty(trim($params['login'])) 
            && strlen($params['login']) <= 20
            && !empty(trim($params['email'])) 
            && filter_var($params['email'], FILTER_VALIDATE_EMAIL) 
            && !empty(trim($params['password'])) 
            && !empty(trim($params['name']))
            && preg_match("/^[A-Za-z '-]+$/",$params['name'])
            && strlen($params['name']) <= 20)
            {
                $params['role_id'] = 1;
                
                $model = new Users();
                $model->create($params);                
                return json_encode(['status'=>'success']);
            } return json_encode(['status'=>'fail']);

        } catch (\Exception $e) {
            return json_encode([
                'status'=>'error', 
                'message'=>$e->getMessage()
            ]);
        }
    }

    public function login(): string
    {
        try {
            if (!empty($_POST)){
                $model = new Users(); 
                $user = $model->auth($_POST['login'], $_POST['password']); // $user récupère les résultats de la fonction auth()

                if(empty($user)) {
                    return json_encode(['status'=>'failed']);
                }

                if (Session::isActive()) { 
                    $_SESSION['login'] = $user['login'];
                    $_SESSION['user_id'] = $user['id'];
                    var_dump($_SESSION['user_id']);die();
                    $_SESSION['id_session'] = session_id(); 
                    // problème à résoudre : le session_id() est toujours le même
                    
                    $model = new Sessions(); 
                    $model->create(); // crée une ligne dns la table session_user avec le login et le session_id

                    return json_encode(['status'=>'success', 'connected'=>Session::isActive(), 'login'=>$_SESSION['login']]);
                }
                return json_encode(['status'=>'fail', 'message'=>'session failed']);
            }
            return json_encode(['status'=>'fail', 'message'=>'body is empty']);

        } catch (\Exception $e) {
            return json_encode([
                'status'=>'error', 
                'message'=> $e->getMessage()
            ]);
        }
    }

    public function logout(): string
    {
        try {
            if(Session::isActive() && Session::isConnected()){
                
                $modelSession = new Sessions();
                $session = $modelSession->delete($_SESSION['login']); // delete la ligne de la table session_user
                
                // var_dump($_SESSION['id_session']); // 'li9hcn6cipasqe8aodnoqh03s2'
                // var_dump($_SESSION['login']); // 'user_3
                // var_dump(Session::isActive()); // true
                // var_dump(Session::isConnected()); // true 
                
                Session::destroy(); // supprime la session de l'user ainsi que $_SESSION avec id_session et login
                
                // var_dump(Session::isActive()); // false
                // var_dump(Session::isConnected()); // false
                // var_dump($_SESSION['id_session']); // null
                // var_dump($_SESSION['login']); // null
                
                // die();
                // session_destroy();
                
            }
            return json_encode(['status'=>'disconnect', 'connected'=>Session::isConnected()]);

        } catch (\Exception $e) {
            return json_encode([
                'status'=>'error', 
                'message'=>$e->getMessage()
            ]);
        }
    }

    public function display() // fonction en GET 
    { 
        // on utilise le user_id qu'est en session
        // instancier le modèle
        // dans le modèle, y a le read du CRUD à faire
        // au niveau du read on utilise $user->read($_SESSION['user_id']);
        // retourner ça en json_encode
        
        try {
            if(Session::isConnected()){
            // $modelUser = new Users();
            // $user = $modelUser->readOne($_SESSION['user_id']);

            $modelSession = new Sessions();
            $session = $modelSession->readBy($_SESSION['user_id']);
            

            // header('Content-Type: application/json');
            // return json_encode([
            //     'connected'=>Session::isConnected(),
            //     '$user'=>$user,
            //     '$user_id'=>$user['id'],
            //     '$_SESSION[id_session]'=>$_SESSION['id_session']
            // ]);
            header('Content-Type: application/json');
            return json_encode([
                'connected'=>Session::isConnected(),
                '$login'=>$_SESSION['login'],
                // '$user_id'=>$user['id'],
                '$_SESSION[id_session]'=>$_SESSION['id_session']
            ]);

            // return json_encode($_SESSION['login'], JSON_FORCE_OBJECT);
            }
            // die;
            // $model = new Sessions();
            // $session = $model->readOne($_SESSION['login']);
            
            // if($session['id']){
            //     $model = new Users(); 
            //     $user = $model->readOne($_SESSION['user_id']);
                
            //     return json_encode($user, JSON_FORCE_OBJECT);
                // var_dump($_SESSION['user_id']); // 33         
                
                // return json_encode($user, JSON_FORCE_OBJECT);
                // print(json_encode([$user=>JSON_PRETTY_PRINT]));
                // var_dump($user);
                // return json_encode(['var_dump'=>"$_SESSION['user_id']"]);
                
            // }

            
            
            // return json_encode(['connected'=>Session::isConnected(), 'message'=>'pourquoi tu te lies pas ?']);
            
        } catch (\Exception $e) {
            return json_encode([
                'status'=>'error', 
                'message'=>$e->getMessage()
            ]);
        }
    }

    public function update()
    {
        try {
            //code...
        } catch (\Exception $e) {
            return json_encode([
                'status'=>'error', 
                'message'=>$e->getMessage()
            ]);
        }
    }
}
