<?php

namespace Services;

use DateTime;
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

    public function encrypt(string $login, string $password): string
    {
        date_default_timezone_set('Europe/Paris');
        $tokenUser = [
            'login' => $login,
            'password' => $password,
            'expired_at' => (new DateTime())->modify('+30 min')->format('Y-m-d H:i:s'),
        ];

        return $this->encryption->encrypt(json_encode($tokenUser));
    }

    public function decrypt($encryptedData): array
    {
        return json_decode(json_decode($this->encryption->decrypt($encryptedData), true), true);
    }

    public function isExpired($tokenData, $user): bool
    {
        date_default_timezone_set('Europe/Paris');
        
        if (empty($user['login'])
        || empty($user['password'])
        || $tokenData['login'] !== $user['login']
        || $tokenData['password'] !== $user['password']
        || strtotime($tokenData['expired_at']) < time()
        ){
            return true;
        }
        return false;
    }
}
