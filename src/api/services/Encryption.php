<?php

namespace Services;

class Encryption
{
    private const CIPHER = 'aes-256-cbc';
    private string $key;
    private string $iv;

    public function setKey(string $key): Encryption
    {
        $this->key = $key;
        return $this;
    }

    public function setIv(string $iv): Encryption
    {
        $this->iv = $iv;
        return $this;
    }

    public function encrypt($data): string
    {
        return openssl_encrypt(json_encode($data), self::CIPHER, $this->key, 0, $this->iv);
    }

    public function decrypt(string $data): mixed
    {
        return openssl_decrypt($data, self::CIPHER, $this->key, 0, $this->iv);
    }
}
