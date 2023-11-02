<?php

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
