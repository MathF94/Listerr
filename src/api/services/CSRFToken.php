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

use DateTime;
use Services\Encryption;

/**
 * La classe CSRFToken gère la création et la validation de jetons CSRF pour prévenir les attaques CSRF.
 */
class CSRFToken
{
    private const KEY = 'a2bc2fca-fef5-41b6-a1cc-6e53447b704e';
    private const IV = '0880-492f-998bA1';
    private $csrfToken;
    private $encryption;

    public function __construct()
    {
        $this->encryption = new Encryption();
        $this->encryption->setKey(self::KEY)
            ->setIv(self::IV);
    }

    /**
     * Génère un jeton CSRF chiffré pour un formulaire.
     *
     * @param string $formId - L'identifiant du formulaire associé au jeton CSRF.
     * @return string - Le jeton CSRF chiffré.
     */
    public function encrypt(string $formId): string
    {
        date_default_timezone_set('Europe/Paris');
        $csrfToken = [
            'formToken' => $this->generateAPIToken(),
            'formId' => $formId,
            'expired_at' => (new DateTime())->modify('+5 min')->format('Y-m-d H:i:s'),
        ];

        return $this->encryption->encrypt(json_encode($csrfToken));
    }

    /**
     * Vérifie si un jeton CSRF est valide.
     *
     * @param string $csrfToken - Le jeton CSRF à valider.
     * @param string $formId - L'identifiant du formulaire associé au jeton CSRF.
     * @return bool - Renvoie true si le jeton est valide, sinon false.
     */
    public function isValidToken(string $csrfToken, string $formId): bool
    {
        $decryptedToken = $this->decrypt($csrfToken);

        if (empty($csrfToken)) {
            return false;
        }

        if ($decryptedToken['formToken'] !== $_SESSION['token']) {
            return false;
        }

        if ($decryptedToken['formId'] !== $formId) {
            return false;
        }

        if (strtotime($decryptedToken['expired_at']) < time()) {
            return false;
        }
        return true;
    }

    private function decrypt(string $csrfToken): ?array
    {
        return json_decode(json_decode($this->encryption->decrypt($csrfToken), true), true);
    }

    private function generateAPIToken(): string
    {
        return $_SESSION['token'] = bin2hex(random_bytes(24));
    }

    /**
     * Aide au chiffrement du jeton CSRF en réponse à une requête.
     *
     * Cette méthode récupère le champ "formId" du $_POST, qui correspond à l'ID du formulaire renvoyé via le CSRFToken.js,
     *               chiffre cette valeur et l'envoie en paramètre de la méthode encrypt() pour générer un CSRF Token.
     *
     * @return string - Réponse JSON : "success csrfToken" avec le jeton CSRF chiffré, en cas de succès.
     *                                 "fail" avec un message d'erreur, en cas d'échec.
     */
    public function CSRFToken(): string
    {
        try {
            $formId = $_POST["formId"];
            $encryptedCSRFToken = $this->encrypt($formId);

            return json_encode([
                "status" => "success csrfToken",
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
}
