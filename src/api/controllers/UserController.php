<?php

namespace Controllers;

use Entity\User;
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
        try {
            $errors = $this->validator->isValidParams($_POST, Validator::CONTEXT_REGISTER);
            if (empty(count($errors))) {
                $params = $_POST;
                $params['password'] = $this->encryption->encrypt($params['password']);
                $params['role_id'] = User::ROLE_USER;
                $model = new Users();
                $model->create($params);

                return json_encode([
                    'status' => 'success'
                ]);
            }
            
            return json_encode([
                'status' => 'fail',
                'errors' => $errors
            ]);

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
            $errors = $this->validator->isValidParams($_POST, Validator::CONTEXT_LOGIN);
            if (empty(count($errors))) {
                $encrytedPassword = $this->encryption->encrypt($_POST['password']);
                $model = new Users();
                $user = $model->auth($_POST['login'], $encrytedPassword);

                if (empty($user)) {

                    return json_encode([
                        'status' => 'fail_data',
                        'message' => 'Votre identifiant n\'existe pas ou votre mot de passe est incorrect.'
                    ]);
                }

                $session = new Session();
                $encryptToken = $session->encrypt($user->id, $user->login, $encrytedPassword);
                return json_encode([
                    'status' => 'success',
                    'connected' => true,
                    'token' => $encryptToken,
                    'user_id' => $user->id,
                    'user_login' => $user->login,
                    'user_role' => $user->role,
                ]);
            };
            return json_encode([
                'status' => 'fail',
                'errors' => $errors]);

        } catch (\Exception $e) {
            return json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        };
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
                };

                if (!$session->isExpired($decrypt, $user)) {
                    return json_encode([
                        'status' => 'connected',
                        'id' => ['label' => 'id', 'value' => $user->id],
                        'name' => ['label' => 'Nom', 'value' => $user->name],
                        'firstname' => ['label' =>'Prénom', 'value' => $user->firstname],
                        'email' => ['label' =>'E-mail', 'value' => $user->email],
                        'login' => ['label' =>'Login', 'value' => $user->login],
                        'role' => ['label' =>'Role', 'value' => $user->role],
                    ]);

                } else {
                    return json_encode([
                        'status' => 'disconnected',
                        'message' => 'La connexion a été perdue, merci de vous reconnecter'
                    ]);
                };
            };
            return json_encode([
                'status' => 'fail',
                'message' => 'body is empty'
            ]);

        } catch (\Exception $e) {
            return json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        };
    }

    public function readUsers(): string
    {
        try {
            $model = new Users();
            $usersList = $model->readAll();

            return json_encode([
                'status' => 'success',
                'data' => $usersList
            ]);

        } catch (\Exception $e) {
            return json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        };
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
            };

            $isExpired = $session->isExpired($decryptToken, $user);
            if (!$isExpired) {
                return json_encode([
                    'status' => 'connected',
                    'connected' => true,
                    'message' => 'still connected.',
                    'token' => $tokenUser,
                    'login' => $decryptToken['login'],
                ]);
            };
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
            };

        } catch (\Exception $e) {
            return json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        };
    }

    public function update($tokenUser)
    {
        try {
            $errors = $this->validator->isValidParams($_POST, Validator::CONTEXT_UPDATE_USER);
            if (empty(count($errors))) {
                $id = $_POST['id'];
                $params = [
                    'name' => $_POST['name'],
                    'firstname' => $_POST['firstname'],
                    'login' => $_POST['login'],
                    'email' => $_POST['email']
                ];
                $modelUser = new Users();
                $modelUser->update($params, $id);
                return json_encode(['status' => 'success']);
            };

            return json_encode([
                'status' => 'fail',
                'errors' => $errors
            ]);

        } catch (\Exception $e) {
            return json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        };
    }

    public function delete($tokenUser): string
    {
        try {
            $session = new Session();
            $decryptToken = $session->decrypt($tokenUser);
            $users = new Users();
            $user = $users->readOne($decryptToken['login']);
            if (!empty($user)) {

                $users->delete($user->login);

                return json_encode([
                    'status' => 'unsubscribed',
                    'message' => 'le compte a bien été supprimé.'
                ]);
            };
            return json_encode(['status' => 'fail']);

        } catch (\Exception $e) {
            return json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        };
    }
}
