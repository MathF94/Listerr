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

$allowedDomains = [
    'https://listerr.tea-tux.fr',
    'https://listerr.lan',
    'https://listerr.local',
    'http://localhost',
    'http://127.0.0.1'
];

// Définition des constantes de la base de données
if (!defined('DB_HOST')) {
    define("DB_HOST", '{{DB_HOST}}');
    define("DB_NAME", '{{DB_NAME}}');
    define("DB_USER", '{{DB_USER}}');
    define("DB_PASS", '{{DB_PASS}}');
}

if (!empty($_SERVER['REQUEST_SCHEME']) && !empty($_SERVER['HTTP_REFERER'])) {
    if(!defined('APP_HOST')) {
        define('APP_HOST', $_SERVER['HTTP_REFERER']);
    }
}

if (!empty($_SERVER['REQUEST_SCHEME']) && !empty($_SERVER['HTTP_ORIGIN'])) {
    if(!defined('APP_HOST')) {
        define('APP_HOST', $_SERVER['HTTP_ORIGIN']);
    }
}

if (!empty($_SERVER['REQUEST_SCHEME']) && !empty($_SERVER['HTTP_HOST'])) {
    if(!defined('APP_HOST')) {
        define('APP_HOST', $_SERVER['HTTP_HOST']);
    }
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
function cors($allowedDomains)
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

cors($allowedDomains);
