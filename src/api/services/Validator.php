<?php

namespace Services;

/**
 * Classe pour la validation des paramètres en fonction du contexte.
 */
class Validator
{
    public const CONTEXT_REGISTER = 'register';
    public const CONTEXT_LOGIN = 'login';
    public const CONTEXT_UPDATE_USER = 'user_update';
    public const CONTEXT_CREATE_LIST = 'create_list';
    public const CONTEXT_UPDATE_LIST = 'update_list';
    public const CONTEXT_CREATE_CARD = 'create_card';
    public const CONTEXT_UPDATE_CARD = 'update_card';
    public const CONTEXT_CREATE_RESERVATION = 'create_reservation';
    public const CONTEXT_CREATE_FEATURE = 'create_feature';
    public const CONTEXT_UPDATE_FEATURE = 'update_feature';

    /**
     * Valide les paramètres en fonction du contexte donné.
     *
     * @param array  $params  Les paramètres à valider.
     * @param string $context Le contexte de validation.
     * @return array Un tableau d'erreurs, le cas échéant.
     */
    public function isValidParams(array $params, string $context): array
    {
        switch ($context) {
            case self::CONTEXT_REGISTER:
                $errors = $this->isValidRegisterParams($params);
                return $errors;

            case self::CONTEXT_LOGIN:
                $errors = $this->isValidLoginParams($params);
                return $errors;

            case self::CONTEXT_UPDATE_USER:
                $errors = $this->isValidUpdateUserParams($params);
                return $errors;

            case self::CONTEXT_CREATE_LIST:
                $errors = $this->isValidListParams($params);
                return $errors;

            case self::CONTEXT_UPDATE_LIST:
                $errors = $this->isValidListParams($params);
                return $errors;

            case self::CONTEXT_CREATE_CARD:
                $errors = $this->isValidCardParams($params);
                return $errors;

            case self::CONTEXT_UPDATE_CARD:
                $errors = $this->isValidCardParams($params);
                return $errors;

            case self::CONTEXT_CREATE_RESERVATION:
                $errors = $this->isValidReservationParams($params);
                return $errors;

            case self::CONTEXT_CREATE_FEATURE:
                $errors = $this->isValidFeatureParams($params);
                return $errors;

            case self::CONTEXT_UPDATE_FEATURE:
                $errors = $this->isValidFeatureParams($params);
                return $errors;

            default:
            return ["error" => "Invalid context"];
        }
    }

    /**
     * Valide les paramètres lors de l'enregistrement d'un utilisateur.
     *
     * @param array $params Les paramètres à valider.
     * @return array Un tableau d'erreurs, le cas échéant. Chaque élément du tableau est une chaîne de caractères décrivant l'erreur.
     */
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
        } elseif (strlen($params['name']) < 1 || strlen($params['name']) > 20) {
            $errors[] = 'Le champ "Nom" doit comporter entre 3 et 20 caractères.';
        } elseif (!preg_match("/^[[A-Za-zÀ-ÿ '-]+$/", $params['name'])) {
            $errors[] = 'Le champ "Nom" ne peut contenir que des lettres, des espaces, des tirets et des apostrophes.';
        }

        if (empty(trim($params['firstname']))) {
            $errors[] = 'Le champ "Prénom" est requis.';
        } elseif (strlen($params['firstname']) < 1 || strlen($params['firstname']) > 20) {
            $errors[] = 'Le champ "Prénom" doit comporter entre 3 et 20 caractères.';
        } elseif (!preg_match("/^[A-Za-zÀ-ÿ '-]+$/", $params['firstname'])) {
            $errors[] = 'Le champ "Prénom" ne peut contenir que des lettres, des espaces, des tirets et des apostrophes.';
        }

        return $errors;
    }

    /**
     * Valide les paramètres lors d'une tentative de connexion de l'utilisateur.
     *
     * @param array $params Les paramètres à valider.
     * @return array Un tableau d'erreurs, le cas échéant. Chaque élément du tableau est une chaîne de caractères décrivant l'erreur.
     */
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

    /**
     * Valide les paramètres lors de la mise à jour d'informations de l'utilisateur.
     *
     * @param array $params Les paramètres à valider.
     * @return array Un tableau d'erreurs, le cas échéant. Chaque élément du tableau est une chaîne de caractères décrivant l'erreur.
     */
    private function isValidUpdateUserParams(array $params): array
    {
        $errors = [];
        $expectedKeys = ['updateId', 'login', 'name', 'firstname', 'email'];
        $paramKeys = array_keys($params);

        if (!empty(array_diff($expectedKeys, $paramKeys))) {
            $changedKey = array_diff($expectedKeys, $paramKeys);
            $errors[] = "Le/les champs suivante(s) a/ont été modifiée(s) : " . implode(', ', $changedKey) . ". Merci de ne pas y toucher, merci !";
            return $errors;
        }

        if (empty($params['updateId'])) {
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

    /**
     * Valide les paramètres lors de la création ou de la mise à jour d'une liste.
     *
     * @param array $params Les paramètres à valider.
     * @return array Un tableau d'erreurs, le cas échéant. Chaque élément du tableau est une chaîne de caractères décrivant l'erreur.
     */
    private function isValidListParams(array $params): array
    {
        $errors = [];
        $expectedKeys = ['typeList', 'titleList', 'descriptionList'];
        $paramKeys = array_keys($params);

        if (!empty(array_diff($expectedKeys, $paramKeys))) {
            $changedKey = array_diff($expectedKeys, $paramKeys);
            $errors[] = "Le/les champs suivante(s) a/ont été modifiée(s) : " . implode(', ', $changedKey) . ". Merci de ne pas y toucher, merci !";
            return $errors;
        }

        if (empty(trim($params['titleList']))) {
            $errors[] = 'Le champ "titre" est requis.';
        } elseif (strlen($params['titleList']) > 50) {
            $errors[] = 'Le champ "titre" ne doit pas dépasser 20 caractères.';
        }

        return $errors;
    }

    private function isValidCardParams(array $params): array
    {
        $errors = [];
        $expectedKeys = ['titleCard', 'descriptionCard', 'priority'];
        $paramKeys = array_keys($params);

        if (!empty(array_diff($expectedKeys, $paramKeys))) {
            $changedKey = array_diff($expectedKeys, $paramKeys);
            $errors[] = "Le/les champs suivante(s) a/ont été modifiée(s) : " . implode(', ', $changedKey) . ". Merci de ne pas y toucher, merci !";
            return $errors;
        }

        if (empty(trim($params['titleCard']))) {
            $errors[] = 'Le champ "titre" est requis.';
        } elseif (strlen($params['titleCard']) > 50) {
            $errors[] = 'Le champ "titre" ne doit pas dépasser 20 caractères.';
        }

        if (empty(trim($params['priority']))) {
            $errors[] = 'Le champ "priorité" est requis.';
        } elseif (!preg_match('/^[1-5]+$/', $params['priority'])) {
            $errors[] = 'La chaîne ne doit contenir que les chiffres allant de 1 à 5.';
        } elseif (strlen($params['priority']) > 5) {
            $errors[] = 'La priorité ne doit pas être supérieure à 5.';
        } elseif (strlen($params['priority']) < 1) {
            $errors[] = 'La priorité ne doit pas être inférieure à 1.';
        }
        return $errors;
    }

    private function isValidReservationParams(array $params): array
    {
        $errors = [];
        $expectedKeys = ['name', 'email'];
        $paramKeys = array_keys($params);

        if (!empty(array_diff($expectedKeys, $paramKeys))) {
            $changedKey = array_diff($expectedKeys, $paramKeys);
            $errors[] = "Le/les champs suivante(s) a/ont été modifiée(s) : " . implode(', ', $changedKey) . ". Merci de ne pas y toucher, merci !";
            return $errors;
        }

        if (empty(trim($params['name']))) {
            $errors[] = 'Le champ "Login" est requis.';
        } elseif (strlen($params['name']) > 20) {
            $errors[] = 'Le champ "Login" ne doit pas dépasser 20 caractères.';
        }
        return $errors;

        if (empty(trim($params['email']))) {
            $errors[] = 'Le champ "Email" est requis.';
        } elseif (!filter_var($params['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'L\'adresse mail n\'est pas valide.';
        }
    }

    /**
     * Valide les paramètres lors de la création ou de la mise à jour d'une liste.
     *
     * @param array $params Les paramètres à valider.
     * @return array Un tableau d'erreurs, le cas échéant. Chaque élément du tableau est une chaîne de caractères décrivant l'erreur.
     */
    private function isValidFeatureParams(array $params): array
    {
        $errors = [];
        $expectedKeys = [
            'titleFeature',
            'descriptionFeature'
        ];
        $paramKeys = array_keys($params);

        if (!empty(array_diff($expectedKeys, $paramKeys))) {
            $changedKey = array_diff($expectedKeys, $paramKeys);
            $errors[] = "Le/les champs suivante(s) a/ont été modifiée(s) : " . implode(', ', $changedKey) . ". Merci de ne pas y toucher, merci !";
            return $errors;
        }

        if (empty(trim($params['titleFeature']))) {
            $errors[] = 'Le champ "titre" est requis.';
        } elseif (strlen($params['titleFeature']) > 100) {
            $errors[] = 'Le champ "titre" ne doit pas dépasser 100 caractères.';
        }

        return $errors;
    }
}
