<?php

if (!defined("DB_HOST")) {
    define("DB_HOST", "localhost");
    define("DB_NAME", "listerr");
    define("DB_USER", "root");
    define("DB_PASS", "");
}

/**
 * CORS est une instruction permet d"établir des critères de sécurités afinde contrôler
 * les entrées sur le serveur de domaines inconnus
 * et donc pour accepter des requêtes venues de l"extérieur
 */
function cors()
{

    if(
        !array_key_exists("REQUEST_SCHEME", $_SERVER) &&
        !array_key_exists("HTTP_ORIGIN", $_SERVER) &&
        !array_key_exists("HTTP_HOST", $_SERVER) &&
        !array_key_exists("HTTP_REFERER", $_SERVER)
    ) {
        return; // on sort de la fonction cors()
    }

    $allowedDomains = [
        "http://listerr.lan",
        "http://listerr.local",
        "http://localhost",
        "http://127.0.0.1",
        "http://127.0.0.1:5500",
        "https://mathieufagot.ide.3wa.io"
    ];

    if(!empty($_SERVER["HTTP_REFERER"])) {
        $domain = $_SERVER["REQUEST_SCHEME"] . "://" . parse_url($_SERVER["HTTP_REFERER"], PHP_URL_HOST);
    }

    if(!empty($_SERVER["REQUEST_SCHEME"]) && !empty($_SERVER["HTTP_ORIGIN"])) {
        $domain = $_SERVER["REQUEST_SCHEME"] . "://" . parse_url($_SERVER["HTTP_ORIGIN"], PHP_URL_HOST);
    }

    if(!empty($_SERVER["REQUEST_SCHEME"]) && !empty($_SERVER["HTTP_HOST"])) {
        $domain = $_SERVER["REQUEST_SCHEME"] . "://" . parse_url($_SERVER["HTTP_HOST"], PHP_URL_HOST);
    }

    if (in_array($domain, $allowedDomains, true)) {
        header("Access-Control-Allow-Origin: {$domain}");
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
        header("Access-Control-Allow-Headers: X-PINGARUNER");
        header("Access-Control-Max-Age: 1728000");
        header("Content-Length: 0");
        header("Content-Type: text/plain");
    }
}

cors();
