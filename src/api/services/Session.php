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
use Entity\User;
use Services\Encryption;

/**
 * Classe pour la gestion des sessions utilisateur.
 */
class Session
{
    /**
     * https://duckduckgo.com/?t=lm&q=uuid&ia=answer
     */
    private const KEY = '53a8d4d4-c0d6-42be-87fe-aca42aad1dfc';
    private const IV = 'ca24db0e-3065-40';
    private $encryption;

    /**
     * Initialise une nouvelle instance de la classe Session.
     */
    public function __construct()
    {
        $this->encryption = new Encryption();
        $this->encryption->setKey(self::KEY)
            ->setIv(self::IV);
    }

    /**
     * Chiffre les données de session utilisateur.
     *
     * @param int    $id       L'ID de l'utilisateur.
     * @param string $login    Le nom d'utilisateur.
     * @param string $email    L'email d'utilisateur.
     * @param string $password Le mot de passe de l'utilisateur.
     * @return string Les données de session chiffrées.
     */
    public function encrypt(int $id, string $login, string $email, string $password): string
    {
        date_default_timezone_set('Europe/Paris');
        $tokenUser = [
            'id' => $id,
            'login' => $login,
            'email' => $email,
            'password' => $password,
            'expired_at' => (new DateTime())->modify('+1 hour')->format('Y-m-d H:i:s'),
        ];

        return $this->encryption->encrypt(json_encode($tokenUser));
    }

    /**
     * Chiffre les données de session utilisateur.
     *
     * @param int    $listId       L'ID de la liste contenant la carte réservée.
     * @param int    $cardId       L'ID de la carte réservée.
     * @param string $login    Le nom d'utilisateur.
     * @param string $mail     Le mail de l'utilisateur.
     * @return string Les données de session chiffrées.
     */
    public function encryptGuestToken(string $name, string $mail, int $listId, int $cardId): string
    {
        date_default_timezone_set('Europe/Paris');
        $tokenGuest = [
            'name' => $name,
            'email' => $mail,
            'list_id' => $listId,
            'card_id' => $cardId,
            'created_at' => (new DateTime())->format('Y-m-d H:i:s'),
        ];

        return $this->encryption->encrypt(json_encode($tokenGuest));
    }

    /**
     * Déchiffre les données de session utilisateur.
     *
     * @param string $encryptedData Les données de session chiffrées.
     * @return array Les données de session déchiffrées.
     */
    public function decrypt(string $encryptedData): array
    {
        return json_decode(json_decode($this->encryption->decrypt($encryptedData), true), true);
    }

    /**
     * Vérifie si les données de session sont expirées ou invalides.
     *
     * @param array $tokenData Les données de session déchiffrées.
     * @param User  $user      L'objet utilisateur.
     * @return bool Vrai si les données de session sont expirées ou invalides, sinon faux.
     */
    public function isExpired(array $tokenData, User $user): bool
    {
        date_default_timezone_set('Europe/Paris');

        if (
            empty($user->login)
            || empty($user->password)
            || $tokenData['login'] !== $user->login
            || $tokenData['password'] !== $user->password
            || strtotime($tokenData['expired_at']) < time()
        ) {
            return true;
        }
        return false;
    }
}
