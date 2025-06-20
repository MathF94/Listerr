<?php

/*
 * listerr - gestionnaire de listes et tâches
 * Copyright (C) 2025 Mathieu Fagot
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

namespace Services;

/**
 * Classe de base pour la gestion de la base de données.
 * Cette classe fournit des méthodes permettant d'interagir avec la base de données MySQL.
 */
class Database
{
    protected $db;

    /**
     * Constructeur de la classe. Initialise la connexion à la base de données.
     *
     * @throws \PDOException En cas d'échec de la connexion à la base de données.
     */
    public function __construct()
    {
        try {
            $this->db = new \PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8", DB_USER, DB_PASS, [
                \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC, // retourne un tableau indexé par le nom de la colonne
                \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION // lance PDOExeptions
            ]);
        } catch (\Exception $e) {
            return json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    /**
     * Exécute une requête SQL SELECT et retourne tous les enregistrements correspondants.
     *
     * @param string $req La requête SQL SELECT.
     * @param array $params Les paramètres à lier à la requête.
     *
     * @return array Les enregistrements correspondants sous forme de tableau associatif.
     *
     * @throws \PDOException En cas d'erreur lors de l'exécution de la requête.
     */
    protected function findAll(string $req, array $params = []): array
    {
        try {
            $query = $this->db->prepare($req);
            $query->execute($params);

            return $query->fetchAll(); // Récupérer un jeu d'enregistrements

        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Exécute une requête SQL SELECT et retourne le premier enregistrement correspondant.
     *
     * @param string $req La requête SQL SELECT.
     * @param array $params Les paramètres à lier à la requête.
     *
     * @return array Le premier enregistrement correspondant sous forme de tableau associatif.
     *
     * @throws \PDOException En cas d'erreur lors de l'exécution de la requête.
     */
    protected function findOne(string $req, array $params = []): array
    {
        try {
            $query = $this->db->prepare($req);
            $query->execute($params);
            $result = $query->fetch(); // Récupérer un enregistrement

            if (empty($result)) {
                return [];
            }
            return $result;
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Exécute une requête SQL et retourne le résultat sous forme de tableau associatif.
     *
     * @param string $req La requête SQL.
     * @param array $params Les paramètres à lier à la requête.
     *
     * @return mixed Le résultat de la requête sous forme de tableau associatif.
     *
     * @throws \PDOException En cas d'erreur lors de l'exécution de la requête.
     */
    protected function executeReq(string $req, array $params = []): mixed
    {
        try {
            $query = $this->db->prepare($req);
            $query->execute($params);
            return $query->fetch(\PDO::FETCH_ASSOC);
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }
}
