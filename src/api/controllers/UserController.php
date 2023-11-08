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
     * Cette méthode récupère le champ "formId" de la variable superglobale $_POST, qui correspond à l'id du formulaire renvoyé via le CSRFToken.js,
     *               chiffre cette valeur et l'envoie en paramètre de la méthode encrypt() pour générer un CSRF Token.
     * La méthode renvoie ensuite le résultat encodé en JSON.
     *
     * @return string - Le résultat est encodé au format JSON avec le statut "success" et le jeton CSRF en cas de succès.
     *                - Le résultat est encodé au format JSON avec le statut "error" et un message d'erreur en cas d'échec.
     */
    public function CSRFToken()
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
     * @return string - Réponse JSON : "success" en cas de succès, "fail" avec un message d'erreur en cas d'échec.
     */
    public function register($csrfToken): string
    {
        try {
            $validToken = $this->csrfToken->isValidToken($csrfToken, "registerForm");

            if (!$validToken) {
                return json_encode([
                    "status" => "fail",
                    "message" => "jeton invalide"
                ]);
            }

            $errors = $this->validator->isValidParams($_POST, Validator::CONTEXT_REGISTER);
            if (empty(count($errors))) {
                $params = $_POST;
                $params["password"] = $this->encryption->encrypt($params["password"]);
                $params["role_id"] = User::ROLE_USER;
                $model = new Users();
                $create = $model->create($params);

                if ($create) {
                    return json_encode([
                        "status" => "success"
                    ]);
                }
                return json_encode([
                    "status" => "fail",
                    "errors" => "Ce login existe déjà"
                ]);
            }
            return json_encode([
                "status" => "fail",
                "errors" => $errors
            ]);
        } catch (\Exception $e) {
            return json_encode([
                "status" => "error",
                "message" => $e->getMessage()
            ]);
        }
    }

    /**
     * Cette méthode permet la connexion du nouvel utilisateur, après validation du jeton CSRF.
     *                      la création d'un jeton Utilisateur chiffré.
     *
     * @param string - $csrfToken - Jeton CSRF pour valider l'utilisation du formulaire.
     * @return string - En cas de succès :
     *                   1- Réponse JSON : "success"
     *                   2- Récupération du jeton Utilisateur chiffré, de l'id, du login et du rôle de l'utilisateur
     *                - En cas d'échec :
     *                   Réponse JSON : "fail" avec un message d'erreur.
     */
    public function login($csrfToken): string
    {
        try {
            $validToken = $this->csrfToken->isValidToken($csrfToken, "loginForm");

            if (!$validToken) {
                return json_encode([
                    "status" => "fail",
                    "message" => "jeton invalide"
                ]);
            }

            $errors = $this->validator->isValidParams($_POST, Validator::CONTEXT_LOGIN);
            if (empty(count($errors))) {
                $encrytedPassword = $this->encryption->encrypt($_POST["password"]);
                $model = new Users();
                $user = $model->auth($_POST["login"], $encrytedPassword);

                if (empty($user)) {
                    return json_encode([
                        "status" => "fail_data",
                        "message" => "Votre identifiant n\'existe pas ou votre mot de passe est incorrect."
                    ]);
                }
                $session = new Session();
                $encryptToken = $session->encrypt($user->id, $user->login, $encrytedPassword);
                return json_encode([
                    "status" => "success",
                    "connected" => true,
                    "token" => $encryptToken,
                    "user_id" => $user->id,
                    "user_login" => $user->login,
                    "user_role" => $user->role,
                ]);
            };
            return json_encode([
                "status" => "fail",
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
     * @return string - En cas de succès :
     *                   1- Réponse JSON : "success" ;
     *                   2- Récupération des informations de l'utilisateur.
     *                - En cas d'échec :
     *                   Réponse JSON : "disconnected" avec un message d'erreur invitant à se reconnecter.
     */
    public function read(string $tokenUser, ?int $userId = null): string
    {
        try {
            if (!empty($tokenUser)) {
                $session = new Session();
                $decrypt = $session->decrypt($tokenUser);
                $login = $decrypt["login"];
                $modelUser = new Users();
                // faire une condition en fonction du $_GET pour récupérer l'id à visualiser
                if (empty($userId)) {
                    $user = $modelUser->readOne($login);

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
                    // fonction readById
                    $user = $modelUser->readById((int)$userId);
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

                if (empty($user)) {
                    return json_encode([
                        "status" => "unknown user"
                    ]);
                };
            };
            return json_encode([
                "status" => "fail",
                "message" => "body is empty"
            ]);
        } catch (\Exception $e) {
            return json_encode([
                "status" => "error",
                "message" => $e->getMessage()
            ]);
        };
    }

    /**
     * Cette méthode permet l'affichage de tous les utilisateurs.
     *
     * @return string - En cas de succès :
     *                   1- Réponse JSON : "success" ;
     *                   2- Récupération des informations des utilisateurs.
     *                - En cas d'échec :
     *                   Réponse JSON : "error" avec un message d'erreur.
     */
    public function readUsers(): string
    {
        try {
            $model = new Users();
            $usersList = $model->readAll();

            return json_encode([
                "status" => "success",
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
     * Cette méthode permet la déconnexion d'un utilisateur, après :
     *               vérifie l'expiration du jeton Utilisateur.
     *
     * @return string - 1 - si le jeton est expiré, la déconnexion est automatique, réponse JSON : "disconnect".
     *                     - 2 - si le jeton n"est pas expiré, possibilité de se déconnecter, répnse JSON : "connected".
     *                - 3 - si l'utilisateur est vide, réponse JSON : "error".
     */
    public function logout($tokenUser): string
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
                    "status" => "error",
                    "message" => "unknown user"
                ]);
            };

            $isExpired = $session->isExpired($decryptToken, $user);
            if (!$isExpired) {
                return json_encode([
                    "status" => "connected",
                    "connected" => true,
                    "message" => "still connected.",
                    "token" => $tokenUser,
                    "login" => $decryptToken["login"],
                ]);
            };
            if ($isExpired) {
                $session = new Session();
                $decryptToken = $session->decrypt($tokenUser);
                return json_encode([
                    "status" => "disconnect",
                    "connected" => false,
                    "message" => "Vous êtes déjà déconnecté(e).",
                    "token" => $tokenUser,
                    "login" => $decryptToken["login"],
                ]);
            };
        } catch (\Exception $e) {
            return json_encode([
                "status" => "error",
                "message" => $e->getMessage()
            ]);
        };
    }

    /**
     * Cette méthode permet la mise à jour des informations d'un utilisateur, après :
     *                  1 - validation du jeton CSRF ;
     *                  2 - vérification de l'existence du jeton Utilisateur.
     *
     * @param string - $csrfToken - Jeton CSRF pour valider l'utilisation du formulaire.
     *               - $tokenUser - Jeton Utilisateur pour valider la requête.
     * @return string - Réponse JSON : "success" en cas de succès, "fail" avec un message d'erreur en cas d'échec.
     */
    public function update(string $tokenUser, string $csrfToken,): string
    {
        try {
            $validToken = $this->csrfToken->isValidToken($csrfToken, "updateForm");

            if (!$validToken) {
                return json_encode([
                    "status" => "fail",
                    "message" => "jeton invalide"
                ]);
            }

            $session = new Session();
            $decryptToken = $session->decrypt($tokenUser);
            $users = new Users();
            $user = $users->readOne($decryptToken["login"]);

            if (!empty($user)) {
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
                    $modelUser->update($params, $id);

                    return json_encode(["status" => "success"]);
                };

                return json_encode([
                    "status" => "fail",
                    "errors" => $errors
                ]);
            }
        } catch (\Exception $e) {
            return json_encode([
                "status" => "error",
                "message" => $e->getMessage()
            ]);
        };
    }

    /**
     * Cette méthode permet la suppression d'un utilisateur, après vérification de l'existence du jeton Utilisateur.
     *
     * @param string - $tokenUser - Jeton Utilisateur.
     * @return string - Réponse JSON : "unsubscribed" en cas de succès, "fail" en cas d'échec.
     */
    public function delete($tokenUser): string
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

            return json_encode(["status" => "fail"]);
        } catch (\Exception $e) {
            return json_encode([
                "status" => "error",
                "message" => $e->getMessage()
            ]);
        };
    }
}
