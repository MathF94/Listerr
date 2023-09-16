<?php

namespace Controllers;

use Models\Users;
use Models\Sessions;
use Services\Session;

class UserController
{
    public function register(): string
    {
        try {
            $params = $_POST;

            if (
                !empty(trim($params['login']))
                && strlen($params['login']) <= 20
                && !empty(trim($params['email']))
                && filter_var($params['email'], FILTER_VALIDATE_EMAIL)
                && !empty(trim($params['password']))
                && !empty(trim($params['name']))
                && preg_match("/^[A-Za-z '-]+$/", $params['name'])
                && strlen($params['name']) <= 20
            ) {
                $params['role_id'] = 1;

                $model = new Users();
                $model->create($params);
                return json_encode(['status' => 'success']);
            }
            return json_encode(['status' => 'fail']);
            
        } catch (\Exception $e) {
            return json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    public function login(): string
    {
        try {
            if (!empty($_POST)) {
                $model = new Users();
                $user = $model->auth($_POST['login'], $_POST['password']); // $user récupère les résultats de la fonction auth()

                if (empty($user)) {
                    return json_encode(['status' => 'failed']);
                }

                if (Session::isActive()) {
                    $model = new Sessions();
                    $session = $model->readBy(['login'=>$_POST['login']]);
                    if (empty($session)) {
                        $model->create($user['login'], session_id()); // crée une ligne dns la table session_user avec le login et le session_id
                    } 

                    return json_encode([
                        'status' => 'success',
                        'connected' => Session::isActive(),
                        'login' => $user['login']
                    ]);
                }
                return json_encode(['status' => 'fail', 'message' => 'session failed']);
            }
            return json_encode(['status' => 'fail', 'message' => 'body is empty']);
        } catch (\Exception $e) {
            return json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    public function logout(): string
    {
        try {
            if (Session::isActive() && Session::isConnected()) {
                
                $modelSession = new Sessions();
                $session = $modelSession->readBy(['login'=>$_POST['login']]);
                if (!empty($session)){
                    $modelSession->delete($session['id']); // delete la ligne de la table session_user

                    Session::destroy(); // supprime la session de l'user ainsi que $_SESSION avec id_session et login
                }
            }
            return json_encode(['status' => 'disconnect',
                                'connected' => Session::isConnected()]);

        } catch (\Exception $e) {
            return json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    public function display() // fonction en GET 
    {
        try {
            if (Session::isConnected()) {                
                $modelSession = new Sessions();
                $session = $modelSession->readBy(['login'=>$_GET['login']]);

                // header('Content-Type: application/json');
                // return json_encode([
                //     'connected'=>Session::isConnected(),
                //     '$user'=>$user,
                //     '$user_id'=>$user['id'],
                //     '$_SESSION[id_session]'=>$_SESSION['id_session']
                // ]);
                header('Content-Type: application/json');
                return json_encode([
                    'connected' => Session::isConnected(),
                    '$login' => $session['login'],
                    // '$user_id'=>$user['id'],
                    '$session[id_session]' => $session['id_session']
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
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    public function update()
    {
        try {
            //code...
        } catch (\Exception $e) {
            return json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }
}
