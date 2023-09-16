<?php

if (!defined('DB_HOST')) {
    define("DB_HOST", 'localhost');
    define("DB_NAME", 'listerr');
    define("DB_USER", 'root');
    define("DB_PASS", '');
}

/**
 * CORS est une instruction permet d'établir des critères de sécurités afinde contrôler 
 * les entrées sur le serveur de domaines inconnus
 * et donc pour accepter des requêtes venues de l'extérieur
 */
$allowedDomains = [
    'http://lister.lan',
    'http://lister.local',
    'http://localhost',
];



// SI HTTP_REFERER a un domaine (HOST) qui correspond à $allowedDomains 
// OU SI HTTP_ORIGIN est définie et correspondant à $allowedDomains 
// ALORS ...

if (
    (in_array($_SERVER['REQUEST_SCHEME'] . '://' . parse_url($_SERVER['HTTP_REFERER'], PHP_URL_HOST), $allowedDomains)) || 
    (array_key_exists('HTTP_ORIGIN', $_SERVER) && in_array($_SERVER['HTTP_ORIGIN'], $allowedDomains, true))
    ) {
        
    echo $domain = !empty($_SERVER['HTTP_ORIGIN']) 
    ? $_SERVER['HTTP_ORIGIN'] 
    : $_SERVER['REQUEST_SCHEME'] . '://' . parse_url($_SERVER['HTTP_REFERER'], PHP_URL_HOST);


    header("Access-Control-Allow-Origin: {$domain}");
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: X-PINGARUNER');
    header('Access-Control-Max-Age: 1728000');
    header("Content-Length: 0");
    header("Content-Type: text/plain");
    
}
