<?php

namespace Models;

use Services\Database;

/**
 * La classe Cards gère les opérations liées à l'envoi des mails.
 */
class SendMails extends Database
{
    /**
     * Cette méthode permet de récupérer les ID de connexion pour le serveur SMTP pour l'envoi de mail (PHPMailer).
     *
     * @param int $id - ID de la réservation à récupérer.
     */
    public function getConfigMailById(int $id): array
    {
        try {
            $req = "SELECT `id`,
                            `name`,
                            `config`
                    FROM `config_mail`
                    WHERE `id` = :id";

        $result = $this->findOne($req, ['id' => $id]);
        return $result;

        } catch (\Exception $e) {
            echo $e->getMessage();
            return null;
        }
    }
}