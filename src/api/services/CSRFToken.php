<?php

namespace Listerr\Service;

use DateTime;
use Listerr\Service\Encryption;

/**
 * La classe CSRFToken gère la création et la validation de jetons CSRF pour prévenir les attaques CSRF.
 */
class CSRFToken
{
    private const KEY = 'a2bc2fca-fef5-41b6-a1cc-6e53447b704e';
    private const IV = '0880-492f-998bA1';
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
}
