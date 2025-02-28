<?php

namespace Controllers;

use Models\Features;
use Models\Users;
use Services\CSRFToken;
use Services\SendMail;
use Services\Session;
use Services\Validator;

/**
 * Classe représentant un objet d'une feature.
 */

class FeatureController
{
    private $csrfToken;
    private $validator;
    private $user;

    /**
     * Constructeur de la classe ListController.
     *
     * Ce constructeur initialise les dépendances nécessaires et authentifie un utilisateur, en utilisant un jeton fourni.
     * Il est appelé lors de la création d'une instance de ListController.
     *
     * @param string $tokenUser - Le jeton d'utilisateur utilisé pour l'authentification.
     */
    public function __construct($tokenUser)
    {
        $this->csrfToken = new CSRFToken();
        $this->validator = new Validator();
        $session = new Session();

        // Si un jeton d'utilisateur est fourni, l'utilisateur est décrypté et d'authentifié.
        if (!empty($tokenUser)) {
            $decrypt = $session->decrypt($tokenUser);
            $model = new Users();
            $this->user = $model->auth($decrypt["login"], $decrypt["password"]);
        }
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
                "status" => "success Feature csrfToken",
                "csrfToken" => $encryptedCSRFToken,
            ]);

        } catch (\Exception $e) {
            return json_encode([
                "status" => "errors",
                "message" => $e->getMessage()
            ]);
        }
    }

    /**
     * Cette méthode permet la création d'une nouvelle liste, après validation du jeton CSRF.
     * @param string $csrfToken - Jeton CSRF pour valider la requête.
     *
     * @return string - Réponse JSON : "createList" avec un message, en cas de succès.
     *                                 "createList failed" avec un message d'erreur, si l'utilisateur est introuvable.
     *                                 "fail" avec un message d'erreur, si le jeton est invalide.
     *                                 "errors" avec un message d'erreur, en cas d'échec.
     */
    public function createFeature(string $csrfToken): string
    {
        try {
            $validToken = $this->csrfToken->isValidToken($csrfToken, "formFeature");
            if (!$validToken) {
                return json_encode([
                    "status" => "fail",
                    "message" => "no valid csrfToken"
                ]);
            }

            if (!empty($this->user)) {
                $errors = $this->validator->isValidParams($_POST, Validator::CONTEXT_CREATE_FEATURE);
                if (empty(count($errors))) {
                    $params = $_POST;
                    $model = new Features();
                    $create = $model->createFeature($params, $this->user->id);

                    if ($create) {
                        return json_encode([
                            "status" => "createFeature",
                            "message" => "la feature a bien été créée."
                        ]);

                        // $sendMail = new SendMail();
                        // // $mail = $sendMail->getElementMailFeature($params, $this->user);
                        // if ($mail) {
                        // }
                    } else {
                        return json_encode([
                            "status" => "no createFeature",
                            "message" => "la feature ne s'est pas créée."
                        ]);
                    }
                } else {
                    return json_encode([
                        "status" => "errors",
                        "errors" => $errors
                    ]);
                }
            }
            return json_encode([
                "status" => "createFeature failed",
                "message" => "no user found"
            ]);

        } catch (\Exception $e) {
            return json_encode([
                "status" => "errors",
                "message" => $e->getMessage()
            ]);
        }
    }

    public function readAllFeatures(): string
    {
        try {
            $model = new Features();
            $allFeatures = $model->readAllFeatures();

            if (empty($allFeatures)) {
                return json_encode([
                    "status" => "standBy",
                    "message" => "no features list found"
                ]);
            }
            return json_encode([
                "status" => "ReadAllFeatures",
                "data" => $allFeatures
            ]);
        } catch (\Exception $e) {
            return json_encode([
                "status" => "error",
                "message" => $e->getMessage()
            ]);
        }
    }

    /**
     * Cette méthode permet la mise à jour des informations d'une Feature, après validation du jeton CSRF.
     * @param int $id - L'ID de la Feature à mettre à jour.
     * @param string $csrfToken - Jeton CSRF pour valider la requête.
     *
     * @return string - Réponse JSON : "updateFeature" avec un message, en cas de succès.
     *                                 "updateFeature failed" avec un message d'erreur, si l'utilisateur est introuvable.
     *                                 "fail" avec un message d'erreur, si le jeton est invalide.
     *                                 "fail" avec un message d'erreur, si la Feature est introuvable.
     *                                 "errors" avec un message d'erreur, en cas d'éch
     */
    public function updateFeature(int $id, string $csrfToken): string
    {
        try {
            $validToken = $this->csrfToken->isValidToken($csrfToken, "formUpdateFeature");
            if (!$validToken) {
                return json_encode([
                    "status" => "fail",
                    "message" => "no valid csrfToken"
                ]);
            }

            if (!empty($this->user->id)) {
                $model = new Features();
                $feature = $model->getOneFeatureById($id);

                if (empty($feature)) {
                    return json_encode([
                        "status" => "fail",
                        "errors" => "no feature found"
                    ]);
                }

                $errors = $this->validator->isValidParams($_POST, Validator::CONTEXT_UPDATE_FEATURE);
                if (empty(count($errors))) {
                    $featureId = $feature->id;
                    $params = [
                        'type' => $_POST['typeFeature'],
                        'title' => $_POST['titleFeature'],
                        'description' => $_POST['descriptionFeature'],
                        'status' => $_POST['statusFeature'],
                    ];
                    $model->updateFeature($params, $featureId);
                    return json_encode([
                        "status" => "[Admin]updateFeature",
                        "message" => "la feature a bien été mise à jour."
                    ]);
                }
                return json_encode([
                    "status" => "errors",
                    "errors" => $errors
                ]);
            }
            return json_encode([
                "status" => "updateList failed",
                "message" => "no user found"
            ]);
        } catch (\Exception $e) {
            return json_encode([
                "status" => "errors",
                "message" => $e->getMessage()
            ]);
        }
    }

    public function updateStatusFeature(int $id): string
    {
        try {
            if (!empty($this->user->id)) {
                $model = new Features();
                $feature = $model->getOneFeatureById($id);

                if (empty($feature)) {
                    return json_encode([
                        "status" => "fail",
                        "errors" => "no feature found"
                    ]);
                }

                $featureId = $feature->id;
                    $params = ['status' => $_POST['statusFeature']];
                    $model->updateStatusFeature($params, $featureId);
                    return json_encode([
                        "status" => "[Admin]updateStatusFeature",
                        "message" => "la feature a bien été mise à jour."
                    ]);

            }
        } catch (\Exception $e) {
            return json_encode([
                "status" => "errors",
                "message" => $e->getMessage()
            ]);
        }
    }


    /**
     * Cette méthode permet la suppression d'une feature.
     * @param int $id - L'ID de la feature à supprimer.
     *
     * @return string - Réponse JSON : "deletedFeature" avec un message, en cas de succès.
     *                                 "deletedFeature failed" avec un message d'erreur, si l'utilisateur est introuvable.
     *                                 "fail" avec un message d'erreur, si la feature est introuvable.
     *                                 "errors" avec un message d'erreur, en cas d'échec.
     */
    public function deleteFeature(int $id): string
    {
        try {
            if (!empty($this->user->id)) {
                $model = new Features();
                $feature = $model->getOneFeatureById($id);

                if (!empty($feature)) {
                    $model->deleteFeature($feature->id);

                    return json_encode([
                        "status" => "deleteFeature",
                        "message" => "la feature a bien été supprimée."
                    ]);
                }
                return json_encode([
                    "status" => "fail",
                    "message" => "no Feature found"
                ]);
            }
            return json_encode([
                "status" => "deleteFeature failed",
                "message" => "no user found"
            ]);
        } catch (\Exception $e) {
            return json_encode([
                "status" => "errors",
                "message" => $e->getMessage()
            ]);
        }
    }
}