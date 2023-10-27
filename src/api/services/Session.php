<?php

namespace Services;

use DateTime;
use Entity\User;
use Services\Encryption;

class Session
{
    /**
     * https://duckduckgo.com/?t=lm&q=uuid&ia=answer
     */
    private const KEY = '53a8d4d4-c0d6-42be-87fe-aca42aad1dfc';
    private const IV = 'ca24db0e-3065-40';
    private $encryption;

    public function __construct()
    {
        $this->encryption = new Encryption();
        $this->encryption->setKey(self::KEY)
                        ->setIv(self::IV);
    }

    public function encrypt(int $id, string $login, string $password): string
    {
        date_default_timezone_set('Europe/Paris');
        $tokenUser = [
            'id' => $id,
            'login' => $login,
            'password' => $password,
            'expired_at' => (new DateTime())->modify('+1 hour')->format('Y-m-d H:i:s'),
        ];

        return $this->encryption->encrypt(json_encode($tokenUser));
    }

    public function decrypt(string $encryptedData): array
    {
        return json_decode(json_decode($this->encryption->decrypt($encryptedData), true), true);
    }

    public function isExpired(array $tokenData, User $user): bool
    {
        date_default_timezone_set('Europe/Paris');

        if (empty($user->login)
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
