<?php

namespace Controllers;

use Models\Users;
use Services\Session;
use Services\Encryption;
use Services\Validator;

class UserController
{
    private const KEY = 'ec5362dc-0e29-4313-aa0d-529206a4badb';
    private const IV = '855d-4787-a9c8-e';
    private $validator;
    private $encryption;

    public function __construct()
    {
        $this->validator = new Validator();
        $this->encryption = new Encryption();
        $this->encryption->setKey(self::KEY)
            ->setIv(self::IV);
    }

    public function register(): string
    {
        try { // mettre en place le array_key_exists() pour les formulaires
            if ($this->validator->isValidParams($_POST, Validator::CONTEXT_REGISTER)) {
                $params = $_POST;
                $params['password'] = $this->encryption->encrypt($params['password']);
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
        try { // mettre en place le array_key_exists() pour les formulaires
            if ($this->validator->isValidParams($_POST, Validator::CONTEXT_LOGIN)) {
                $encrytedPassword = $this->encryption->encrypt($_POST['password']);
                $model = new Users();
                $user = $model->auth($_POST['login'], $encrytedPassword);

                if (empty($user)) {
                    return json_encode([
                        'status' => 'failed',
                        'message' => 'Identifiant ou mot de passe incorrect'
                    ]);
                }

                $session = new Session();
                $encryptToken = $session->encrypt($user['login'], $encrytedPassword);

                return json_encode([
                    'status' => 'success',
                    'connected' => true,
                    'token' => $encryptToken
                ]);

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

    public function logout($tokenUser): string
    {
        try {
            $session = new Session();
            $decryptToken = $session->decrypt($tokenUser); // login, password et expired_at du token
            $users = new Users();
            $user = $users->readOne($decryptToken['login']); // donnée de l'utilisateur (login, password... de la table)

            if (empty($user)) {
                return json_encode([
                    'status' => 'error',
                    'message' => "unknown user : {$decryptToken['login']}"
                ]);
            }

            $isExpired = $session->isExpired($decryptToken, $user);

            // si false = pas expiré = encore connecté => on peut logout
            if (!$isExpired) {
                return json_encode([
                    'status' => 'connect',
                    'connected' => true,
                    'message' => 'Vous allez être déconnecté(e).',
                    'token' => $tokenUser,
                    'login' => $decryptToken['login'],
                ]);
            }
            // si true = expiré = déjà déconnecté
            if ($isExpired) {
                $session = new Session();
                $decryptToken = $session->decrypt($tokenUser);
                return json_encode([
                    'status' => 'disconnect',
                    'connected' => false,
                    'message' => 'Vous êtes déjà déconnecté(e).',
                    'token' => $tokenUser,
                    'login' => $decryptToken['login'],
                ]);
            }
        } catch (\Exception $e) {
            return json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    public function read($tokenUser): string
    {
        try {
            if (!empty($tokenUser)) {
                $session = new Session();
                $decrypt = $session->decrypt($tokenUser);

                $login = $decrypt['login'];
                $modelUser = new Users();
                $user = $modelUser->readOne($login);

                if (empty($user)) {
                    return json_encode([
                        'status' => 'unknown user'
                    ]);
                }
                if (!$session->isExpired($decrypt, $user)) {
                    return json_encode([
                        'status' => 'connected',
                        'Nom' => $user['name'],
                        'Prénom' => $user['firstname'],
                        'E-mail' => $user['email'],
                        'Login' => $user['login'],
                    ]);
                } else {
                    return json_encode([
                        'status' => 'disconnected',
                        'message' => 'La connexion a été perdue, merci de vous reconnecter'
                    ]);
                }
            }

            return json_encode(['status' => 'fail', 'message' => 'body is empty']);
        } catch (\Exception $e) {
            return json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    public function update($tokenUser) // @TODO
    {
        try { // mettre en place le array_key_exists() pour les formulaires
            if ($this->validator->isValidParams($_POST, Validator::CONTEXT_UPDATE_USER)) {
                // récupérer le user grâce au readOne($_POST) pour vérifier qu'il existe en base
                // s'il n'existe pas, on renvoie un json_encode qui renvoie une erreur

                //
            }

            var_dump($tokenUser);
            var_dump('test modif');
            // $modelSession = new Sessions();
            // $session = $modelSession->readOne($tokenUser);

            $user = new Users();
            // $data = $user->readOne($session['login']);

            $id = null;
            $name = null;
            $firstname = null;
            $email = null;

            if (!empty($data['id'])) {
                $id = $data['id'];
                $name = $data['name'];
                $firstname = $data['firstname'];
                $login = $data['login'];
                $email = $data['email'];
                // var_dump($data);

                return json_encode([
                    'status' => 'update',
                    'name' =>  $name,
                    'firstname' =>  $firstname,
                    'login' =>  $login,
                    'email' =>  $email,
                ]);
            }

            if (!empty($_POST)) {
                var_dump($_POST);

                $id = $_POST['id'];
                $params = [
                    'name' => $_POST['name'],
                    'firstname' => $_POST['firstname'],
                    'login' => $_POST['firstname'],
                    'email' => $_POST['email']
                ];

                if (
                    !empty($params['name'])
                    && !empty($params['firstname'])
                    && !empty($params['login'])
                    && !empty($params['email'])
                ) {

                    $modelUser = new Users();
                    $modelUser->update($params, $id);
                    var_dump($params);
                    die();
                }
            }
        } catch (\Exception $e) {
            return json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    // public function update(array $params, int $id): mixed
    // {
    //     if (!empty($_POST)) {
    //         var_dump($_POST);

    //         $id = $_POST['id'];
    //         $params = [
    //             'name' => $_POST['name'],
    //             'firstname' => $_POST['firstname'],
    //             'login' => $_POST['firstname'],
    //             'email' => $_POST['email']
    //         ];
    //         if (!empty($params['name'])
    //         && !empty($params['firstname'])
    //         && !empty($params['login'])
    //         && !empty($params['email'])) {

    //         $modelUser = new Users();
    //         $modelUser->update($params, $id);
    //         }
    //     }
    // }

    public function delete($tokenUser): string
    {
        try {
            $session = new Session();
            $decryptToken = $session->decrypt($tokenUser); // login, password et expired_at du token
            $users = new Users();
            $user = $users->readOne($decryptToken['login']); // donnée de l'utilisateur (login, password... de la table)
            if (!empty($user)) {
                $users->delete($user['login']);

                return json_encode(['status' => 'unsubscribed', 'message' => 'le compte a bien été supprimé']);
            }
            return json_encode(['status' => 'fail']);
        } catch (\Exception $e) {
            return json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }
}
