<?php

namespace Services;

class Database
{
    protected $db;

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

    protected function findAll(string $req, array $params = []): array
    {
        try {
            $query = $this->db->prepare($req);
            $query->execute($params);

            return $query->fetchAll(); // Récupérer un jeu d'enregistrements

        } catch (\Exception $e) {
            return json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

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
            return json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    protected function executeReq(string $req, array $params = []): mixed
    {
        try {
            $query = $this->db->prepare($req);
            $query->execute($params);
            return $query->fetch(\PDO::FETCH_ASSOC);

        } catch (\Exception $e) {
            return json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }
}
