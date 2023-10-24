<?php

namespace Services;

class Validator
{
    public const CONTEXT_REGISTER = 'register';
    public const CONTEXT_LOGIN = 'login';
    public const CONTEXT_UPDATE_USER = 'user_update';
    public const CONTEXT_CREATE_LIST = 'create_list';
    public const CONTEXT_UPDATE_LIST = 'update_list';

    public function isValidParams(array $params, string $context): array
    {
        switch ($context) {
            case self::CONTEXT_REGISTER:
                $errors = $this->isValidRegisterParams($params);
                return $errors;
                break;

            case self::CONTEXT_LOGIN:
                $errors = $this->isValidLoginParams($params);
                return $errors;
                break;

            case self::CONTEXT_UPDATE_USER:
                $errors = $this->isValidUpdateUserParams($params);
                return $errors;
                break;

            case self::CONTEXT_CREATE_LIST:
                $errors = $this->isValidListParams($params);
                return $errors;
                break;
                
            case self::CONTEXT_UPDATE_LIST:
                $errors = $this->isValidListParams($params);
                return $errors;
                break;
        }
    }

    private function isValidRegisterParams(array $params): array
    {
        $errors = [];
        $expectedKeys = ['login', 'name', 'firstname', 'email', 'password'];
        $paramKeys = array_keys($params);

        if (!empty(array_diff($expectedKeys, $paramKeys))) {
            $changedKey = array_diff($expectedKeys, $paramKeys);
            $errors[] = "Le/les champs suivante(s) a/ont été modifiée(s) : " . implode(', ', $changedKey) . ". Merci de ne pas y toucher, merci !";
            return $errors;
        }

        if (empty(trim($params['login']))) {
            $errors[] = 'Le champ "Login" est requis.';
        } elseif (strlen($params['login']) > 20) {
            $errors[] = 'Le champ "Login" ne doit pas dépasser 20 caractères.';
        }

        if (empty(trim($params['email']))) {
            $errors[] = 'Le champ "Email" est requis.';
        } elseif (!filter_var($params['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'L\'adresse email n\'est pas valide.';
        }

        if (empty(trim($params['password']))) {
            $errors[] = 'Le champ "Mot de passe" est requis.';
        } elseif (strlen($params['password']) < 12) {
            $errors[] = 'Le mot de passe doit comporter au moins 12 caractères.';
        } elseif (!preg_match('/^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{12,}$/', $params['password'])) {
            $errors[] = 'Le mot de passe doit contenir au moins une majuscule, un chiffre et un caractère spécial.';
        }

        if (empty(trim($params['name']))) {
            $errors[] = 'Le champ "Nom" est requis.';
        } elseif (strlen($params['name']) < 3 || strlen($params['name']) > 20) {
            $errors[] = 'Le champ "Nom" doit comporter entre 3 et 20 caractères.';
        } elseif (!preg_match("/^[[A-Za-zÀ-ÿ '-]+$/", $params['name'])) {
            $errors[] = 'Le champ "Nom" ne peut contenir que des lettres, des espaces, des tirets et des apostrophes.';
        }

        if (empty(trim($params['firstname']))) {
            $errors[] = 'Le champ "Prénom" est requis.';
        } elseif (strlen($params['firstname']) < 3 || strlen($params['firstname']) > 20) {
            $errors[] = 'Le champ "Prénom" doit comporter entre 3 et 20 caractères.';
        } elseif (!preg_match("/^[A-Za-zÀ-ÿ '-]+$/", $params['firstname'])) {
            $errors[] = 'Le champ "Prénom" ne peut contenir que des lettres, des espaces, des tirets et des apostrophes.';
        }

        return $errors;
    }

    private function isValidLoginParams(array $params): array
    {
        $errors = [];
        $expectedKeys = ['login', 'password'];
        $paramKeys = array_keys($params);

        if (!empty(array_diff($expectedKeys, $paramKeys))) {
            $changedKey = array_diff($expectedKeys, $paramKeys);
            $errors[] = "Le/les champs suivante(s) a/ont été modifiée(s) : " . implode(', ', $changedKey) . ". Merci de ne pas y toucher, merci !";
            return $errors;
        }

        if (empty(trim($params['login']))) {
            $errors[] = 'Le champ "Login" est requis.';
        } elseif ((strlen($params['login']) > 20)) {
            $errors[] = 'Le champ "Login" ne doit pas dépasser 20 caractères.';
        }

        if (empty(trim($params['password']))) {
            $errors[] = 'Le champ "Mot de passe" est requis.';
        } elseif (strlen($params['password']) < 12) {
            $errors[] = 'Le mot de passe doit comporter au moins 12 caractères.';
        } elseif (!preg_match('/^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{12,}$/', $params['password'])) {
            $errors[] = 'Le mot de passe doit contenir au moins une majuscule, un chiffre et un caractère spécial.';
        }

        return $errors;
    }

    private function isValidUpdateUserParams(array $params): array
    {
        $errors = [];
        $expectedKeys = ['id', 'login', 'name', 'firstname', 'email'];
        $paramKeys = array_keys($params);

        if (!empty(array_diff($expectedKeys, $paramKeys))) {
            $changedKey = array_diff($expectedKeys, $paramKeys);
            $errors[] = "Le/les champs suivante(s) a/ont été modifiée(s) : " . implode(', ', $changedKey) . ". Merci de ne pas y toucher, merci !";
            return $errors;
        }

        if (empty($params['id'])) {
            $errors[] = 'Le champ "id" est requis.';
        }

        if (empty(trim($params['login']))) {
            $errors[] = 'Le champ "Login" est requis.';
        } elseif (strlen($params['login']) > 20) {
            $errors[] = 'Le champ "Login" ne doit pas dépasser 20 caractères.';
        }

        if (empty(trim($params['email']))) {
            $errors[] = 'Le champ "Email" est requis.';
        } elseif (!filter_var($params['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'L\'adresse email n\'est pas valide.';
        }

        if (empty(trim($params['name']))) {
            $errors[] = 'Le champ "Nom" est requis.';
        } elseif (strlen($params['name']) < 3 || strlen($params['name']) > 20) {
            $errors[] = 'Le champ "Nom" doit comporter entre 3 et 20 caractères.';
        } elseif (!preg_match("/^[A-Za-zÀ-ÿ '-]+$/", $params['name'])) {
            $errors[] = 'Le champ "Nom" ne peut contenir que des lettres, des espaces, des tirets et des apostrophes.';
        }

        if (empty(trim($params['firstname']))) {
            $errors[] = 'Le champ "Prénom" est requis.';
        } elseif (strlen($params['firstname']) < 3 || strlen($params['firstname']) > 20) {
            $errors[] = 'Le champ "Prénom" doit comporter entre 3 et 20 caractères.';
        } elseif (!preg_match("/^[A-Za-zÀ-ÿ '-]+$/", $params['firstname'])) {
            $errors[] = 'Le champ "Prénom" ne peut contenir que des lettres, des espaces, des tirets et des apostrophes.';
        }

        return $errors;
    }

    private function isValidListParams(array $params): array
    {
        $errors = [];
        $expectedKeys = ['type', 'title', 'description'];
        $paramKeys = array_keys($params);

        if (!empty(array_diff($expectedKeys, $paramKeys))) {
            $changedKey = array_diff($expectedKeys, $paramKeys);
            $errors[] = "Le/les champs suivante(s) a/ont été modifiée(s) : " . implode(', ', $changedKey) . ". Merci de ne pas y toucher, merci !";
            return $errors;
        }

        if (empty(trim($params['title']))) {
            $errors[] = 'Le champ "title" est requis.';
        } elseif (strlen($params['title']) > 50) {
            $errors[] = 'Le champ "titre" ne doit pas dépasser 20 caractères.';
        }

        if (strlen($params['description']) > 100) {
            $errors[] = 'La description ne doit pas dépasser 100 caractères.';
        }

        return $errors;
    }
}
