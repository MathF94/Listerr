<?php

namespace Controllers;

use Entity\User;
use Models\Users;
use Services\Session;
use Services\CSRFToken;
use Services\Encryption;
use Services\Validator;

/**
 * Classe représentant un objet d'un utilisateur.
 */
class UserController
{
    private const KEY = "ec5362dc-0e29-4313-aa0d-529206a4badb";
    private const IV = "855d-4787-a9c8-e";
    private $csrfToken;
    private $validator;
    private $encryption;

    /**
     * Constructeur de la classe UserController.
     *
     * Ce constructeur initialisera les instances des classes Validator, CSRFToken et Encryption nécessaires
     * pour les opérations de contrôle utilisateur, gestion de jetons CSRF et chiffrement de données.
     */
    public function __construct()
    {
        $this->validator = new Validator();
        $this->csrfToken = new CSRFToken();
        $this->encryption = new Encryption();
        $this->encryption->setKey(self::KEY)
            ->setIv(self::IV);
    }

    /**
     * Aide au chiffrement du jeton CSRF en réponse à une requête.
     *
     * Cette méthode récupère le champ "formId" du $_POST, qui correspond à l'ID du formulaire renvoyé via le CSRFToken.js,
     *               chiffre cette valeur et l'envoie en paramètre de la méthode encrypt() pour générer un CSRF Token.
     *
     * @return string - Réponse JSON : "success" avec le jeton CSRF chiffré, en cas de succès.
     *                                 "fail" avec un message d'erreur, en cas d'échec.
     */
    public function CSRFToken(): string
    {
        try {
            $formId = $_POST["formId"];
            $encryptedCSRFToken = $this->csrfToken->encrypt($formId);

            return json_encode([
                "status" => "success",
                "csrfToken" => $encryptedCSRFToken,
            ]);

            return json_encode([
                "status" => "fail",
                "errors" => "errors"
            ]);
        } catch (\Exception $e) {
            return json_encode([
                "status" => "error",
                "message" => $e->getMessage()
            ]);
        }
    }

    /**
     * Cette méthode permet la création d'un nouvel utilisateur, après validation du jeton CSRF.
     *
     * @param string - $csrfToken - Jeton CSRF pour valider l'utilisation du formulaire.
     * @return string - Réponse JSON : "createList" avec un message, en cas de succès.
     *                                 "fail" avec un message d'erreur, si le jeton est invalide.
     *                                 "errors" avec un message d'erreur, en cas d'échec.
     *                                 "errors" avec un message d'erreur, si le login existe déjà.
     */
    public function register(string $csrfToken): string
    {
        try {
            $validToken = $this->csrfToken->isValidToken($csrfToken, "registerForm");

            if (!$validToken) {
                return json_encode([
                    "status" => "fail",
                    "message" => "no valid csrfToken"
                ]);
            }

            $errors = $this->validator->isValidParams($_POST, Validator::CONTEXT_REGISTER);
            if (empty(count($errors))) {
                $params = $_POST;
                $params["password"] = $this->encryption->encrypt($params["password"]);
                $params["role_id"] = User::ROLE_USER;
                $model = new Users();
                $create = $model->createUser($params);

                if ($create) {
                    return json_encode([
                        "status" => "createUser",
                        "message" => "L'utilisateur a bien été créé."
                    ]);
                }
                // si $create est false, il s'agit d'un duplicata d'un champ
                return json_encode([
                    "status" => "errors",
                    "errors" => "Cet utilisateur existe déjà (login ou email), veuillez en trouver un autre svp, merci :)"
                ]);
            }
            return json_encode([
                "status" => "errors",
                "errors" => $errors
            ]);
        } catch (\Exception $e) {
            $message = "Une erreur est survenue";
            if (strpos($e->getMessage(), "user.email") !== false) {
                $message = "Cette adresse mail existe déjà, veuillez en trouver un autre svp, merci :)";
            }
            if (strpos($e->getMessage(), "user.login") !== false) {
                $message = "Ce login existe déjà, veuillez en trouver un autre svp, merci :)";
            }
            return json_encode([
                "status" => "errors",
                "message" => $e->getMessage(),
                "errors" => $message
            ]);
        }
    }

    /**
     * Cette méthode permet la connexion du nouvel utilisateur, après validation du jeton CSRF.
     *                      la création d'un jeton Utilisateur chiffré.
     *
     * @param string - $csrfToken - Jeton CSRF pour valider l'utilisation du formulaire.
     * @return string - Réponse JSON : "loginUser" avec un message, en cas de succès.
     *                                 "loginUser failed" avec un message d'erreur, si le login n'existe pas.
     *                                 "fail" avec un message d'erreur, si le jeton est invalide.
     *                                 "errors" avec un message d'erreur, en cas d'échec.
     */
    public function login(string $csrfToken): string
    {
        try {
            $validToken = $this->csrfToken->isValidToken($csrfToken, "loginForm");

            if (!$validToken) {
                return json_encode([
                    "status" => "fail",
                    "message" => "no valid csrfToken"
                ]);
            }

            $errors = $this->validator->isValidParams($_POST, Validator::CONTEXT_LOGIN);
            if (empty(count($errors))) {
                $encrytedPassword = $this->encryption->encrypt($_POST["password"]);
                $model = new Users();
                $user = $model->auth($_POST["login"], $encrytedPassword);

                if (empty($user)) {
                    return json_encode([
                        "status" => "loginUser failed",
                        "message" => "Votre identifiant n'existe pas ou votre mot de passe est incorrect."
                    ]);
                }
                $session = new Session();
                $encryptToken = $session->encrypt($user->id, $user->login, $encrytedPassword);
                return json_encode([
                    "status" => "loginUser",
                    "connected" => true,
                    "token" => $encryptToken,
                    "user_id" => $user->id,
                    "user_login" => $user->login,
                    "user_role" => $user->role,
                ]);
            };
            return json_encode([
                "status" => "errors",
                "errors" => $errors
            ]);
        } catch (\Exception $e) {
            return json_encode([
                "status" => "error",
                "message" => $e->getMessage()
            ]);
        };
    }

    /**
     * Cette méthode permet l'affichage des informations d'un utilisateur, après vérification de l'existence du jeton Utilisateur.
     *
     * @param string - $tokenUser - Jeton Utilisateur pour valider la requête.
     * @param ?int - $userId - ID utilisateur pour lecture de son profil par l'Admin.
     *
     * @return string - Réponse JSON : "connected" avec data pour lecture profil utilisateur courant, en cas de succès.
     *                                 "disconnected" avec un message si la connexion a été perdue.
     *                                 "[Admin]user" avec data autre profil utilisateur lues par l'admin, en cas de succès.
     *                                 "errors" avec un message d'erreur, en cas d'échec.
     */
    public function readOneUser(string $tokenUser, ?int $userId = null): string
    {
        try {
            if (!empty($tokenUser)) {
                $session = new Session();
                $decrypt = $session->decrypt($tokenUser);
                $login = $decrypt["login"];
                $modelUser = new Users();

                // $userId correspond à l'ID d'un autre utilisateur que l'admin, récupéré via l'URL
                if (empty($userId)) {
                    // fonction readOne pour la lecture du profil de l'utilisateur courant
                    $user = $modelUser->readOne($login);
                    // Si la session de l'utilisateur n'est pas expirée, le profil est affiché
                    if (!$session->isExpired($decrypt, $user)) {
                        return json_encode([
                            "status" => "connected",
                            "id" => ["label" => "id", "value" => $user->id],
                            "name" => ["label" => "Nom", "value" => $user->name],
                            "firstname" => ["label" => "Prénom", "value" => $user->firstname],
                            "email" => ["label" => "E-mail", "value" => $user->email],
                            "login" => ["label" => "Login", "value" => $user->login],
                            "role" => ["label" => "Role", "value" => $user->role],
                        ]);
                    } else {
                        return json_encode([
                            "status" => "disconnected",
                            "message" => "La connexion a été perdue, merci de vous reconnecter"
                        ]);
                    };
                } else {
                    // fonction readById pour la lecture d'un profil utilisateur par l'admin
                    $user = $modelUser->readById((int)$userId);

                    if (empty($user)) {
                        return json_encode([
                            "status" => "[Admin]user failed",
                            "message" => "unknown user"
                        ]);
                    };
                    return json_encode([
                        "status" => "[Admin]user",
                        "id" => ["label" => "id", "value" => $user->id],
                        "name" => ["label" => "Nom", "value" => $user->name],
                        "firstname" => ["label" => "Prénom", "value" => $user->firstname],
                        "email" => ["label" => "E-mail", "value" => $user->email],
                        "login" => ["label" => "Login", "value" => $user->login],
                        "role" => ["label" => "Role", "value" => $user->role],
                    ]);
                }
            };
            return json_encode([
                "status" => "ReadProfil failed",
                "message" => "no user found"
            ]);
        } catch (\Exception $e) {
            return json_encode([
                "status" => "error",
                "message" => $e->getMessage()
            ]);
        };
    }

    /**
     * Cette méthode permet l'affichage de tous les utilisateurs vus par l'Admin sur profils.html
     *
     * @return string - Réponse JSON : "success" avec data pour afficher la liste des utilisateurs, en cas de succès.
     *                                 "fail" avec un message d'erreur, en cas d'échec.
     *                                 "errors" avec un message d'erreur, en cas d'échec.
     */
    public function readAllUsers(): string
    {
        try {
            $model = new Users();
            $usersList = $model->readAll();
            if (empty($usersList)) {
                return json_encode([
                    "status" => "ReadAllUsers failed",
                    "message" => "no users list found"
                ]);
            }
            return json_encode([
                "status" => "ReadAllUsers",
                "data" => $usersList
            ]);
        } catch (\Exception $e) {
            return json_encode([
                "status" => "error",
                "message" => $e->getMessage()
            ]);
        };
    }

    /**
     * Cette méthode permet la déconnexion d'un utilisateur, après vérification l'expiration du jeton Utilisateur.
     *
     * @return string - Réponse JSON : "connected" avec le login de l'utilisateur, si le jeton n'est pas expiré.
     *                                  => possibilité de se déconnecter via logout.js
     *                                 "disconnect" avec le login de l'utilisateur, si le jeton est expiré.
     *                                  ==> suppression jeton utilisateur et redirection automatique vers home.html via logout.js
     *                                 "errors" avec un message d'erreur, en cas d'échec.
     */
    public function logout(string $tokenUser): string
    {
        try {
            $session = new Session();
            // récupère le login, password et expired_at du token
            $decryptToken = $session->decrypt($tokenUser);
            $users = new Users();
            // récupère les données de l'utilisateur (login, password... de la table)
            $user = $users->readOne($decryptToken["login"]);

            if (empty($user)) {
                return json_encode([
                    "status" => "errors",
                    "message" => "unknown user"
                ]);
            };
            $isExpired = $session->isExpired($decryptToken, $user);

            if (!$isExpired) {
                return json_encode([
                    "status" => "connected",
                    "connected" => true,
                    "message" => "la session est encore active.",
                    "login" => $decryptToken["login"],
                ]);
            };
            if ($isExpired) {
                $session = new Session();
                $decryptToken = $session->decrypt($tokenUser);
                return json_encode([
                    "status" => "disconnect",
                    "connected" => false,
                    "message" => "La session a expirée.",
                    "login" => $decryptToken["login"],
                ]);
            };
        } catch (\Exception $e) {
            return json_encode([
                "status" => "errors",
                "message" => $e->getMessage()
            ]);
        };
    }

    /**
     * Cette méthode permet la mise à jour des informations d'un utilisateur, après :
     *                  1 - validation du jeton CSRF ;
     *                  2 - vérification de l'existence du jeton Utilisateur.
     *
     * @param string - $tokenUser - Jeton Utilisateur pour valider la requête.
     * @param string - $csrfToken - Jeton CSRF pour valider l'utilisation du formulaire.
     * @return string - Réponse JSON : "updateUser" avec un message, en cas de succès.
     *                                 "updateUser failed" avec un message d'erreur, si l'utilisateur est introuvable.
     *                                 "fail" avec un message d'erreur, si le jeton est invalide.
     *                                 "fail" avec un message d'erreur, si l'utilisateur est introuvable.
     *                                 "errors" avec un message d'erreur, en cas d'échec.     */
    public function update(string $tokenUser, string $csrfToken,): string
    {
        try {
            $validToken = $this->csrfToken->isValidToken($csrfToken, "updateForm");

            if (!$validToken) {
                return json_encode([
                    "status" => "fail",
                    "message" => "no valid csrfToken"
                ]);
            }
            $session = new Session();
            $decryptToken = $session->decrypt($tokenUser);
            $users = new Users();
            $user = $users->readOne($decryptToken["login"]);

            if (empty($user)) {
                return json_encode([
                    "status" => "fail",
                    "message" => "no user found"
                ]);
            }

            $errors = $this->validator->isValidParams($_POST, Validator::CONTEXT_UPDATE_USER);
            if (empty(count($errors))) {
                $id = $_POST["updateId"];
                $params = [
                    "name" => $_POST["name"],
                    "firstname" => $_POST["firstname"],
                    "login" => $_POST["login"],
                    "email" => $_POST["email"]
                ];
                $modelUser = new Users();
                $update = $modelUser->update($params, $id);

                if ($update) {
                    return json_encode([
                        "status" => "updateUser",
                        "message" => "Le profil a bien été mis à jour."
                    ]);
                }
                // si $update est false, il s'agit d'un duplicata d'un champ
                return json_encode([
                    "status" => "errors",
                    "errors" => "Ce login existe déjà, veuillez en trouver un autre svp, merci :)"
                ]);
            }
            return json_encode([
                "status" => "errors",
                "errors" => $errors
            ]);
        } catch (\Exception $e) {
            $message = "Une erreur est survenue";
            if (strpos($e->getMessage(), "user.email") !== false) {
                $message = "Cette adresse mail existe déjà, veuillez en trouver un autre svp, merci :)";
            }
            if (strpos($e->getMessage(), "user.login") !== false) {
                $message = "Ce login existe déjà, veuillez en trouver un autre svp, merci :)";
            }
            return json_encode([
                "status" => "errors",
                "message" => $e->getMessage(),
                "errors" => $message
            ]);
        }
    }

    /**
     * Cette méthode permet la suppression d'un utilisateur, après vérification de l'existence du jeton Utilisateur.
     *
     * @param string - $tokenUser - Jeton Utilisateur pour valider la requête.
     * @return string - Réponse JSON : "unsubscribed" avec un message, en cas de succès.
     *                                 "fail" avec un message d'erreur, si l'utilisateur est introuvable.
     *                                 "errors" avec un message d'erreur, en cas d'échec.
     */
    public function delete(string $tokenUser): string
    {
        try {
            $session = new Session();
            $decryptToken = $session->decrypt($tokenUser);
            $users = new Users();
            $user = $users->readOne($decryptToken["login"]);

            if (!empty($user)) {
                $users->delete($user->login);

                return json_encode([
                    "status" => "unsubscribed",
                    "message" => "le compte a bien été supprimé."
                ]);
            };
            return json_encode([
                "status" => "fail",
                "message" => "no user found"
            ]);
        } catch (\Exception $e) {
            return json_encode([
                "status" => "errors",
                "message" => $e->getMessage()
            ]);
        };
    }
}
