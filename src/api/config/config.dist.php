<?php

// Définition des constantes de la base de données
if (!defined('DB_HOST')) {
    define("DB_HOST", '{{DB_HOST}}');
    define("DB_NAME", '{{DB_NAME}}');
    define("DB_USER", '{{DB_USER}}');
    define("DB_PASS", '{{DB_PASS}}');
}

/**
 * La méthode CORS (Cross-Origin Resource Sharing) contrôle les requêtes HTTP en provenance de domaines externes.
 *
 * Cette méthode détermine si une requête HTTP est autorisée en fonction de l'origine de la requête.
 * Elle permet d'établir des critères de sécurité pour contrôler l'accès aux ressources du serveur depuis des domaines inconnus.
 *
 * Les domaines autorisés sont spécifiés dans le tableau $allowedDomains, et la fonction ajoute les en-têtes CORS appropriés
 * pour autoriser les requêtes en provenance de ces domaines.
 *
 */
function cors()
{
    // Vérification de la présence des informations HTTP nécessaires
    if (
        !array_key_exists('REQUEST_SCHEME', $_SERVER) &&
        !array_key_exists('HTTP_ORIGIN', $_SERVER) &&
        !array_key_exists('HTTP_HOST', $_SERVER) &&
        !array_key_exists('HTTP_REFERER', $_SERVER)
    ) {
        return; // Sortie de la fonction CORS si les informations nécessaires ne sont pas disponibles
    }

    $allowedDomains = [
        'https://listerr.tea-tux.fr',
        'https://listerr.lan',
        'https://listerr.local',
        'http://localhost',
        'http://127.0.0.1',
        'https://mathieufagot.ide.3wa.io',
        'https://mathieufagot.sites.3wa.io'
    ];

    if (!empty($_SERVER['REQUEST_SCHEME']) && !empty($_SERVER['HTTP_REFERER'])) {
        $domain = $_SERVER['REQUEST_SCHEME'] . '://' . parse_url($_SERVER['HTTP_REFERER'], PHP_URL_HOST);
    }

    if (!empty($_SERVER['REQUEST_SCHEME']) && !empty($_SERVER['HTTP_ORIGIN'])) {
        $domain = $_SERVER['REQUEST_SCHEME'] . '://' . parse_url($_SERVER['HTTP_ORIGIN'], PHP_URL_HOST);
    }

    if (!empty($_SERVER['REQUEST_SCHEME']) && !empty($_SERVER['HTTP_HOST'])) {
        $domain = $_SERVER['REQUEST_SCHEME'] . '://' . parse_url($_SERVER['HTTP_HOST'], PHP_URL_HOST);
    }

    // Vérification et ajout des en-têtes CORS appropriés
    if (in_array($domain, $allowedDomains, true)) {
        header("Access-Control-Allow-Origin: {$domain}");
        header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
        header('Access-Control-Allow-Headers: X-PINGARUNER');
        header('Access-Control-Max-Age: 1728000');
        header("Content-Type: text/plain");
        header("Content-Length: 0");
    }
}

cors();
