<?php

namespace Listerr\Service;

use DateTime;
use Listerr\Entity\User;
use Listerr\Service\Encryption;

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
     * @param string $password Le mot de passe de l'utilisateur.
     * @return string Les données de session chiffrées.
     */
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
