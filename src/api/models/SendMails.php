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
    public function getConfigMailById(int $id): ?array
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