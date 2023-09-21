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

                // création d'un jeton, qui est placé dans le localStorage en JS,
                // pour remplacer la gestion de session
                $tokenUser = hash_hmac('sha512', $user['login'], $user['password']);

                if (!empty($tokenUser)) {
                    $model = new Sessions();
                    $session = $model->readBy(['login' => $_POST['login']]);

                    // Création une ligne dns la table session_user avec le login et le tokenUser
                    if (empty($session)) {
                        // Création de date d'expiration pour la session
                        date_default_timezone_set('Europe/Paris');
                        $expiredAt = new DateTime();
                        $expiredAt->modify('+1 day');
                        $expiredAtFormatted = $expiredAt->format('Y-m-d H:i:s');
                        $model->create($user['login'], $tokenUser, $expiredAtFormatted);
                    }

                    // Retour du token en JSON
                    return json_encode([
                        'status' => 'success',
                        'connected' => true,
                        'token' => $tokenUser
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

    public function display($tokenUser): string
    {
        try {
            if(!empty($tokenUser)) {
                $modelSession = new Sessions();
                $session = $modelSession->readOne($tokenUser);

                $modelUser = new Users();
                $user = $modelUser->readOne($session['login']);
                return json_encode([
                    'status' => 'success',
                    'login' => $user['login'],
                    'password' => $user['password'],
                    'token' => $session['token_user'],
                    'name' => $user['name'],
                    'firstname' => $user['firstname'],
                    'email' => $user['email']
                ]);
            }
            return json_encode(['status' => 'fail', 'message' => 'body is empty']);

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

    public function logout($tokenUser)
    {
        try {
            $modelSession = new Sessions();
            $modelSession->delete($tokenUser); // delete une ligne ciblée de la table session_user
            session_destroy(); // supprime la session de l'user ainsi que

            // EVOLUTION : SI date expiration = new Date() ALORS $modelSession->delete($tokenUser)

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
}
