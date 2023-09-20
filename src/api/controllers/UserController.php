<?php

namespace Controllers;

use DateTime;
use Models\Users;
use Models\Sessions;

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
                && strlen($params['password']) < 11
                && !preg_match('/^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{12,}$/', $params['password'])
                && !empty(trim($params['name']))
                && strlen($params['name']) > 2 || strlen($params['name']) <= 20
                && preg_match("/^[A-Za-z '-]+$/", $params['name'])
                && !empty(trim($params['firstname']))
                && strlen($params['firstname']) > 2 || strlen($params['firstname']) <= 20
                && preg_match("/^[A-Za-z '-]+$/", $params['firstname'])
                ) {
                    $params['role_id'] = 2;
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
                // création d'un jeton pour remplacer la gestion de session
                $token_user = hash_hmac('sha512', $user['login'], $user['password']);

                if (!empty($token_user)) {
                    $model = new Sessions();
                    $session = $model->readBy(['login' => $_POST['login']]);

                    // Création une ligne dns la table session_user avec le login et le token_user
                    if (empty($session)) {
                        // Création de date d'expiration pour la session
                        date_default_timezone_set('Europe/Paris');
                        $expired_at = new DateTime();
                        $expired_at->modify('+1 day');
                        $expired_at_formatted = $expired_at->format('Y-m-d H:i:s');
                        $model->create($user['login'], $token_user, $expired_at_formatted);
                    }

                    // Retour du token en JSON
                    return json_encode([
                        'status' => 'success',
                        'connected' => true,
                        'token' => $token_user
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

    public function logout($token_user)
    {
        try {
            $modelSession = new Sessions();
            $modelSession->delete($token_user); // delete une ligne ciblée de la table session_user
            session_destroy(); // supprime la session de l'user ainsi que

            // EVOLUTION : SI date expiration = new Date() ALORS $modelSession->delete($token_user)

            return json_encode([
                'status' => 'disconnect',
                'connected' => false
            ]);

        } catch (\Exception $e) {
            return json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    public function display() // @TODO - fonction en GET
    {
        try {
            // if (Session::isConnected()) {
            //     $modelSession = new Sessions();
            //     $session = $modelSession->readBy(['login' => $_GET['login']]);

            // header('Content-Type: application/json');
            // return json_encode([
            //     'connected'=>Session::isConnected(),
            //     '$user'=>$user,
            //     '$user_id'=>$user['id'],
            //     '$_SESSION[id_session]'=>$_SESSION['id_session']
            // ]);
            // header('Content-Type: application/json');
            // return json_encode([
            //     'connected' => Session::isConnected(),
            //     '$login' => $session['login'],
            // '$user_id'=>$user['id'],
            // '$session[id_session]' => $session['id_session']
            // ]);

            // return json_encode($_SESSION['login'], JSON_FORCE_OBJECT);
            // }
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

    public function update() // @TODO - fonction en POST
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
