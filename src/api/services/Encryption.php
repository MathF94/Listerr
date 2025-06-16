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
 * Classe pour le chiffrement et le déchiffrement des données.
 */
class Encryption
{
    private const CIPHER = 'aes-256-cbc';
    private string $key;
    private string $iv;

    /**
     * Définit la clé de chiffrement.
     *
     * @param string $key La clé de chiffrement.
     * @return Encryption L'instance de la classe Encryption.
     */
    public function setKey(string $key): Encryption
    {
        $this->key = $key;
        return $this;
    }

    /**
     * Définit le vecteur d'initialisation (IV).
     *
     * @param string $iv Le vecteur d'initialisation.
     * @return Encryption L'instance de la classe Encryption.
     */
    public function setIv(string $iv): Encryption
    {
        $this->iv = $iv;
        return $this;
    }

    /**
     * Chiffre les données avec la clé et l'IV spécifiées.
     *
     * @param mixed $data Les données à chiffrer.
     * @return string Les données chiffrées au format JSON.
     */
    public function encrypt($data): string
    {
        return openssl_encrypt(json_encode($data), self::CIPHER, $this->key, 0, $this->iv);
    }

    /**
     * Déchiffre les données avec la clé et l'IV spécifiées.
     *
     * @param string $data Les données chiffrées.
     * @return mixed Les données déchiffrées.
     */
    public function decrypt(string $data): mixed
    {
        return openssl_decrypt($data, self::CIPHER, $this->key, 0, $this->iv);
    }
}
