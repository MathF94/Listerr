<?php

namespace Models;

use Entity\User;
use Services\Database;
use Services\Encryption;

/**
 * La classe Users gère les opérations liées aux utilisateurs dans la base de données.
 */
class Users extends Database
{
    /**
     * https://duckduckgo.com/?t=lm&q=uuid&ia=answer
     */
    private const KEY = '4f8005a0-516c-4c93-b829-aad0153e6809';
    private const IV = '-1e15-40c7-adb2-5';

    private $encryption;

    public function __construct()
    {
        parent::__construct();
        $this->encryption = new Encryption();
        $this->encryption->setKey(self::KEY)
            ->setIv(self::IV);
    }

    /**
     * Cette méthode permet de créer un nouvel utilisateur dans la base de données.
     *
     * @param array $params - Les paramètres de l'utilisateur à créer.
     * @return bool - Renvoie true en cas de succès, sinon false.
     */
    public function createUser(array $params): bool
    {
        try {
            $req = "INSERT INTO `user` (`login`, `password`, `name`, `firstname`, `email`, `role_id`)
            VALUES (:login, :password, :name, :firstname, :email, :role_id)";

            $params = [
                'login' => mb_strtolower($params['login']),
                'password' => $params['password'],
                'name' => $params['name'],
                'firstname' => $params['firstname'],
                'email' => mb_strtolower($params['email']),
                'role_id' => $params['role_id']
            ];
            $exect = $this->executeReq($req, $params);
            // S'il y a un status et qu'il s'agit d'une erreur de duplicata, dans ce cas, retourne false
            if (isset($exect['status']) && $exect['status'] === "error") {
                return false;
            }
            return true;

        } catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
    }

    /**
     * Cette méthode permet d'authentifier un utilisateur en fonction de son login et mot de passe.
     *
     * @param string $login - Le login de l'utilisateur.
     * @param string $password - Le mot de passe de l'utilisateur.
     * @return User|null - L'objet User correspondant à l'utilisateur authentifié ou null si non trouvé.
     */
    public function auth(string $login, string $password): ?User
    {
        try {
            $req = "SELECT `id`,
                        `login`,
                        `password`,
                        `name`,
                        `firstname`,
                        `email`,
                        `role_id`
                    FROM `user`
                    WHERE `login` = :login
                    AND BINARY `password` = BINARY :password";

            $result = $this->findOne($req, [
                'login'    => $login,
                'password' => $password,
            ]);
            if (empty($result)) {
                return null;
            }

            $user = new User();
            $user->populate($result);
            return $user;
        } catch (\Exception $e) {
            echo $e->getMessage();
            return null;
        }
    }

    /**
     * Cette méthode permet de récupérer les informations d'un utilisateur en fonction de son login.
     *
     * @param string $login - Le login de l'utilisateur à récupérer.
     * @return User|null - L'objet User correspondant à l'utilisateur ou null si non trouvé.
     */
    public function readOne(string $login): ?User
    {
        try {
            $req = "SELECT `id`,
                            `login`,
                            `password`,
                            `name`,
                            `firstname`,
                            `email`,
                            `role_id`
                    FROM `user`
                    WHERE `login` = :login
                    ORDER BY created_at DESC";

            $result = $this->findOne($req, ['login' => $login]);
            $user = new User();
            $user->populate($result);
            return $user;
        } catch (\Exception $e) {
            echo $e->getMessage();
            return null;
        }
    }

    /**
     * Cette méthode permet de récupérer les informations d'un utilisateur en fonction de son ID.
     *
     * @param int $id - L'ID de l'utilisateur à récupérer.
     * @return User|null - L'objet User correspondant à l'utilisateur ou null si non trouvé.
     */
    public function readById(int $id): ?User
    {
        try {
            $req = "SELECT `id`,
                            `login`,
                            `password`,
                            `name`,
                            `firstname`,
                            `email`,
                            `role_id`
                    FROM `user`
                    WHERE `id` = :id
                    ORDER BY created_at DESC";

            $result = $this->findOne($req, ['id' => $id]);
            $user = new User();
            $user->populate($result);
            return $user;
        } catch (\Exception $e) {
            echo $e->getMessage();
            return null;
        }
    }

    /**
     * Cette méthode permet de récupérer les informations de tous les utilisateurs.
     *
     * @return User[] - Un tableau d'objets User représentant tous les utilisateurs.
     */
    public function readAll(): array
    {
        try {
            $req = "SELECT `id`,
                            `login`,
                            `name`,
                            `firstname`,
                            `email`,
                            `password`,
                            `role_id`
                    FROM `user`
                    ORDER BY created_at ASC";

            $results = $this->findAll($req);
            $usersArray = [];

            foreach ($results as $result) {
                $user = new User();
                $user->populate($result);
                $usersArray[] = $user;
            }
            return $usersArray;
        } catch (\Exception $e) {
            echo $e->getMessage();
            return [];
        }
    }

    /**
     * Cette méthode permet de mettre à jour les informations d'un utilisateur dans la base de données.
     *
     * @param array $params - Les paramètres mis à jour de l'utilisateur.
     * @param int $id - L'ID de l'utilisateur à mettre à jour.
     * @return bool - Renvoie true en cas de succès, sinon false.
     */
    public function update(array $params, int $id): bool
    {
        try {
            $req = "UPDATE `user`
                    SET `login`= :login,
                        `name`= :name,
                        `firstname` = :firstname,
                        `email` = :email
                WHERE `id` = :id";
            $query = $this->db->prepare($req);
            $params['id'] = $id;
            $exect = $query->execute($params);

            // S'il y a un status et qu'il s'agit d'une erreur de duplicata, dans ce cas, retourne false
            if (isset($exect['status']) && $exect['status'] === "error") {
                return false;
            }
            return true;

        } catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
    }

    /**
     * Cette méthode permet de mettre à jour les informations d'un utilisateur dans la base de données par l'Administrateur.
     *
     * @param array $params - Les paramètres mis à jour de l'utilisateur.
     * @param int $id - L'ID de l'utilisateur à mettre à jour.
     * @return bool - Renvoie true en cas de succès, sinon false.
     */
    public function updateUserById(array $params, int $id): bool
    {
        try {
            $req = "UPDATE `user`
                    SET `login`= :login,
                        `name`= :name,
                        `firstname` = :firstname,
                        `email` = :email,
                        `role_id` = :role_id
                WHERE `id` = :id";
            $query = $this->db->prepare($req);
            $params['id'] = $id;

            $exect = $query->execute($params);

            // S'il y a un status et qu'il s'agit d'une erreur de duplicata, dans ce cas, retourne false
            if (isset($exect['status']) && $exect['status'] === "errors") {
                return false;
            }
            return true;

        } catch (\Exception $e) {
            throw new \Exception ($e->getMessage());
            return false;
        }
    }

    /********************************************************
     * PREVUE POUR LA VERSION 2
     ********************************************************/
    /**
     * Cette méthode permet de mettre à jour le mot de passe d'un utilisateur dans la base de données.
     *
     * @param array $params - Les paramètres mis à jour, y compris le nouveau mot de passe.
     * @return bool - Renvoie true en cas de succès, sinon false.
     */
    public function updatePassword(array $params): bool
    {
        try {
            $req = "UPDATE `user`
                    SET `password`= :password
                    WHERE `login` = :login";
            $query = $this->db->prepare($req);
            return $query->execute($params);
        } catch (\Exception $e) {
            echo $e->getMessage();
            return [];
        }
    }
    /********************************************************/

    /**
     * Cette méthode permet de suppri;er un utilisateur de la base de données en fonction de son login.
     *
     * @param string $login - Le login de l'utilisateur à supprimer.
     * @return bool - Renvoie true en cas de succès, sinon false.
     */
    public function delete(string $login): bool
    {
        try {
            $req = "DELETE FROM `user`
                    WHERE `login` = :login";

            $query = $this->db->prepare($req);
            return $query->execute(['login' => $login]);
        } catch (\Exception $e) {
            echo $e->getMessage();
            return [];
        }
    }
    /**
     * Cette méthode permet de suppri;er un utilisateur de la base de données en fonction de son login.
     *
     * @param string $login - Le login de l'utilisateur à supprimer.
     * @return bool - Renvoie true en cas de succès, sinon false.
     */
    public function deleteById(int $id): bool
    {
        try {
            $req = "DELETE FROM `user`
                    WHERE `id` = :id";

            $query = $this->db->prepare($req);
            return $query->execute(['id' => $id]);
        } catch (\Exception $e) {
            echo $e->getMessage();
            return [];
        }
    }
}
