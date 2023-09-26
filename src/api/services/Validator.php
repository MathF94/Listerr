<?php

namespace Services;

class Validator
{
    public const CONTEXT_REGISTER = 'register';
    public const CONTEXT_LOGIN = 'login';
    public const CONTEXT_UPDATE_USER = 'update_user';

    public function isValidParams(array $params, string $context): bool
    {
        switch ($context) {
            case self::CONTEXT_LOGIN:
                return $this->isValidLoginParams($params);
                break;

            case self::CONTEXT_REGISTER:
                return $this->isValidRegisterParams($params);
                break;

            case self::CONTEXT_UPDATE_USER:
                return $this->isValidUpdateUserParams($params);
                break;
        }
    }

    private function isValidLoginParams(array $params): bool
    {
        $expectedKeys = ['login', 'password'];
        $paramKeys = array_keys($params);

        if (!empty(array_diff($expectedKeys, $paramKeys))) {
            return false;
        }

        return !empty(trim($params['login']))
            && strlen($params['login']) <= 20
            && !empty(trim($params['password']))
            && strlen($params['password']) < 11
            && !preg_match('/^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{12,}$/', $params['password']);
    }

    private function isValidRegisterParams(array $params): bool
    {
        $expectedKeys = ['login', 'name', 'firstname', 'email', 'password'];
        $paramKeys = array_keys($params);

        if (!empty(array_diff($expectedKeys, $paramKeys))) {
            return false;
        }

        return !empty(trim($params['login']))
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
            && preg_match("/^[A-Za-z '-]+$/", $params['firstname']);
    }

    private function isValidUpdateUserParams(array $params): bool
    {
        return true;
    }
}
