<?php

namespace Services;

class Database
{
    protected $db;

    public function __construct()
    {
        $this->db = new \PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8", DB_USER, DB_PASS, [
            \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC, // retourne un tableau indexé par le nom de la colonne
            \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION // lance PDOExeptions
        ]);
    }

    protected function findAll(string $req, array $params = []): array
    {
        $query = $this->db->prepare($req);
        $query->execute($params);
        return $query->fetchAll(); // Récupérer un jeu d'enregistrements
    }

    protected function findOne(string $req, array $params = []): array
    {
        $query = $this->db->prepare($req);
        $query->execute($params);
        return $query->fetch(); // Récupérer un enregistrement
    }

    protected function executeReq(string $req, array $params = []): mixed
    {        
        $query = $this->db->prepare($req);        
        $query->execute($params);
        return $query->fetch(\PDO::FETCH_ASSOC);        
    }
}
