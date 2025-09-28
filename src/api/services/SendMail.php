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

use Models\Cards;
use Models\Lists;
use Models\SendMails;
use Models\Users;
use PHPMailer\PHPMailer\PHPMailer;
use Services\CSRFToken;
use services\Includes;
use Services\Session;

/**
 * Classe pour l'envoi des mail
 */

class SendMail
{
    private $csrfToken;
    private $modelSendMails;
    private $mail;
    private $configSMTP;

    public function __construct()
    {
        $idMail = 1;
        $this->csrfToken = new CSRFToken();
        $this->modelSendMails = new SendMails();
        $this->configSMTP = $this->modelSendMails->getConfigMailById($idMail);
    }

    public function __destruct()
    {
        $this->mail = null;
    }

    /**
     * Cette méthode permet l'envoi d'une notification suite à une action dans Listerr
     * (création, modification, suppression, réservation)
     *
     * @param object $configSMTPDecode - Configuration SMTP.
     * @param string $subject - Objet du mail.
     * @param string $message - Corps du mail.
     */

    private function mailInit(string $subject, string $message)
    {
        $configSMTPDecode = json_decode($this->configSMTP["config"]);
        $this->mail = new PHPMailer(true);
        $this->mail->isSMTP();                                            // Send using SMTP
        $this->mail->Host       = $configSMTPDecode->smtp;                // Set the SMTP server to send through
        $this->mail->SMTPAuth   = true;                                   // Enable SMTP authentication
        $this->mail->Username   = $configSMTPDecode->username;            // SMTP username
        $this->mail->Password   = $configSMTPDecode->password;            // SMTP password
        $this->mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;         // Enable implicit TLS encryption
        $this->mail->Port       = 587;
        // Recipients (From, To, Copy)
        $this->mail->setFrom($this->mail->Username, 'Admin Listerr');    // Définit l’adresse pour les réponses

        // $mail->addBCC('bcc@example.com');                                   // Destinataire en copie cachée
        $this->mail->isHTML(true);                                             //Set email format to HTML
        $this->mail->Subject = $subject;
        $this->mail->Body = $message;
        $this->mail->CharSet = 'UTF-8';
    }

    /**
     * Cette méthode permet l'envoi d'une notification suite à une action dans Listerr
     * (création, modification, suppression, réservation)
     *
     * @param object $configSMTPDecode - Configuration SMTP.
     * @param string $dataRecipients - Destinataire du mail.
     * @param string $subject - Objet du mail.
     * @param string $message - Corps du mail.
     *
     * @return string - Réponse JSON : "sendMail" avec un message, en cas de succès.
     *                                 "no sendMail" avec un message d'erreur, en cas d'échec.
     *                                 "errors" avec un message d'erreur, en cas d'échec.
     *
     */
    public function sendNotificationMailToUser(array|string $dataRecipients, string $subject, string $message): mixed
    {
        try {
            $this->mailInit($subject, $message);
            $recipients = json_decode($dataRecipients, true);

            // Ajoute des destinataires principaux
            if (is_array($recipients)) {
                foreach ($recipients as $recipient) {
                    $this->mail->addAddress(trim($recipient));
                }
            } else if (is_string($recipients)) {
                $this->mail->addAddress(trim($recipients));
            }

            if ($this->mail->send()) {
                return json_encode([
                    "status" => "sendMail",
                    "message" => "le mail a bien été envoyé."
                ]);
            } else {
                return json_encode([
                    "status" => "no sendMail",
                    "message" => "le mail n'a pas été envoyé."
                ]);
            }

        } catch (\Exception $e) {
            return json_encode([
                "status" => "errors",
                "message" => $e->getMessage()
            ]);
        }
    }
    /**
     * Cette méthode permet l'envoi d'une notification suite à une action dans Listerr
     * (création, modification, suppression, réservation)
     *
     * @param object $configSMTPDecode - Configuration SMTP.
     * @param string $recipient - Destinataire du mail.
     * @param string $subject - Objet du mail.
     * @param string $message - Corps du mail.
     *
     * @return bool - Vrai si mail envoyé
     * @return bool - Faux si mail pas envoyé
     * @return string - Réponse JSON : "errors" avec un message d'erreur, en cas d'échec.
     *
     */
    private function sendNotificationMailToAdmin(string $subject, string $message): mixed
    {
        try {
            $this->mailInit($subject, $message);
            $this->mail->addAddress($this->mail->Username, 'Admin Listerr');      // Ajoute des destinataires principaux
            $this->mail->addCC('julien@tea-tux.fr');                               // Destinataire en copie

            if ($this->mail->send()) {
                return true;
            } else {
                return false;
            }

        } catch (\Exception $e) {
            return json_encode([
                "status" => "errors",
                "message" => $e->getMessage()
            ]);
        }
    }

    /**
     * Cette méthode permet de récupérer les éléments pour construire la notification d'inscription par mail
     * @param array $params - Tableau contenant les informations nécessaires
     *
     * @return bool - Vrai si mail envoyé
     * @return bool - Faux si mail pas envoyé
     * @return string - Réponse JSON : "errors" avec un message d'erreur, en cas d'échec.
     *
     */
    public function getElementMailRegistration(array $params): mixed
    {
        try {
            $name = htmlspecialchars($params['name']);
            $firstname = htmlspecialchars($params['firstname']);
            $login = htmlspecialchars($params['login']);
            $dataRecipient = htmlspecialchars($params['email']);

            $subjectUser = 'Listerr - Votre inscription a bien été prise en compte sur Listerr';
            $messageUser = <<< HTML
                <p>Bonjour {$firstname},</p>
                <p>Nous vous confirmons avoir bien pris en compte votre inscription sur Listerr.</p>
                <br>
                <p>Par sécurité, nous vous conseillons de conserver vos identifiants de connexion dans un gestionnaire de mots de passe.</p>
                <p>Pour toute modification, n'hésitez pas à solliciter l'administrateur de Listerr.</p>
                <br>
                <p>Toute l'équipe de Listerr vous remercie et vous souhaite une bonne journée.</p>
                <br>
                <p>Cordialement,</p>
                <p>Administrateur de Listerr.</p>
                HTML;

            $subjectAdmin = "Listerr - Confirmation d'inscription";
            $messageAdmin = <<< HTML
                <p>Bonjour Math & Julien !</p>
                <br>
                <p>Pour information, un nouvel utilisateur s'est inscrit : </p>
                <p> - Nom : {$name} ; </p>
                <p> - Prénom : {$firstname} ; </p>
                <p> - Login : {$login} ; </p>
                <p> - Email : {$dataRecipient} ; </p>
                <br>
                <p>Bonne journée.</p>
                <p>Administrateur de Listerr.</p>
            HTML;

            // Convertie une string en json_encode
            $recipient = json_encode($dataRecipient);

            // Envoie un mail de confirmation à l'utilisateur qui s'inscrit
            $mailForUser = $this->sendNotificationMailToUser($recipient, $subjectUser, $messageUser);
            // Envoie un mail d'informations d'inscription d'un nouvel utilisateur à l'Admin
            $mailForAdmin = $this->sendNotificationMailToAdmin($subjectAdmin, $messageAdmin);

            return [
                "status" => "success",
                "mailForUser" => json_decode($mailForUser, true),
                "mailForAdmin" => json_decode($mailForAdmin, true)
            ];

        } catch (\Exception $e) {
            return json_encode([
                "status" => "errors",
                "message" => $e->getMessage()
            ]);
        }
    }

    /**
     * Cette méthode permet de récupérer les éléments pour construire la notification de création de cartes par mail
     * @param int $listId - ID de la liste de souhaits
     * @param array|string $dataRecipients - Tableau d'adresses mails ou un seul mail
     * @param string $subject - Objet du mail
     * @param string $message - Corps du mail
     *
     * @return string - Réponse JSON : "sendMail" avec un message, en cas de succès.
     *                                 "no sendMail" avec un message d'erreur, en cas d'échec.
     *                                 "errors" avec un message d'erreur, en cas d'échec.
     *
     */
    public function getElementMailCard(string $csrfToken, int $listId, array|string $dataRecipients, string $subject, string $message): mixed
    {
        try {
            $validToken = $this->csrfToken->isValidToken($csrfToken, "mailForm");

            if (!$validToken) {
                return json_encode([
                    "status" => "fail",
                    "message" => "no valid csrfToken"
                ]);
            }

            if (empty($dataRecipients)) {
                return json_encode([
                    "status" => "errors",
                    "errors" => "Merci de rentrer au moins une adresse e-mail svp :)"
                ]);
            }

            $modelIncludes = new Includes();
            $domain = $modelIncludes->changeDomain();

            $modelLists = new Lists();
            $lists = $modelLists->getOneListById($listId);
            $listUserLogin = htmlspecialchars($lists->user->login);
            $listUserEmail = htmlspecialchars($lists->user->email);

            // $listUserEmail à utiliser pour le from du mail
            $this->mailInit($subject, $message);
            $this->mail->setFrom($listUserEmail, $listUserLogin);

            $recipients = json_decode($dataRecipients, true);

            // Ajoute des destinataires principaux
            if (is_array($recipients)) {
                foreach ($recipients as $recipient) {
                    $this->mail->addAddress(trim($recipient));
                }
            } else if (is_string($recipients)) {
                $this->mail->addAddress(trim($recipients));
            }

            $body =
                <<< HTML
                    <p>Bonjour,</p>
                    <br>
                    <p>$message</p>
                    <p>Voici où le retrouver si besoin - <a href="{$domain}/list/pages/list.html?id={$listId}">lien de la liste de souhaits</a>.</p>
                    <br>
                    <p>Bonne journée.</p>
                    <p>$listUserLogin</p>
                HTML;

            $this->mail->Body = $body;

            if ($this->mail->send()) {
                return json_encode([
                    "status" => "sendMail",
                    "message" => "le mail a bien été envoyé."
                ]);
            } else {
                return json_encode([
                    "status" => "no sendMail",
                    "message" => "le mail n'a pas été envoyé."
                ]);
            }

        } catch (\Exception $e) {
            return json_encode([
                "status" => "errors",
                "message" => $e->getMessage()
            ]);
        }
    }

    /**
     * Cette méthode permet de récupérer les éléments pour construire la notification de réservation par mail
     * @param array $params - Tableau contenant les informations nécessaires :
     *                      - 'list_id' (int) : L'identifiant de la liste.
     *                      - 'card_id' (int) : L'identifiant de la tâche/carte.
     *                      - Autres paramètres requis pour la création d'une réservation.
     *
     * @return bool - Vrai si mail envoyé
     * @return bool - Faux si mail pas envoyé
     * @return string - Réponse JSON : "errors" avec un message d'erreur, en cas d'échec.
     *
     */
    public function getElementMailReservation(array $params): mixed
    {
        try {
            $session = new Session();
            $users = new Users();
            $modelLists = new Lists();
            $modelCards = new Cards();
            $modelIncludes = new Includes();

            $allUsers = $users->readAll();
            $lists = $modelLists->getOneListById($params['list_id']);
            $cards = $modelCards->getOneCardById($params['card_id']);

            $listId = urlencode($params['list_id']);
            $listUserLogin = htmlspecialchars($lists->user->login);
            $listUserEmail = htmlspecialchars($lists->user->email);
            $listTitle = htmlspecialchars($lists->title);
            $cardTitle = htmlspecialchars($cards->title);
            $ReservationUserName = htmlspecialchars($params['name']);
            $ReservationUserEmail = htmlspecialchars($params['email']);
            $domain = $modelIncludes->changeDomain();

            $encryptGuestToken = urlencode(
                $session->encryptGuestToken(
                    $params['name'],
                    $params['email'],
                    $params['list_id'],
                    $params['card_id']
                )
            );

            $subjectUser = 'Listerr - Votre réservation a bien été prise en compte';
            $messageUser = <<< HTML
                <p>Bonjour {$ReservationUserName},</p>
                <br>
                <p>Nous vous confirmons avoir bien pris en compte la réservation du souhait {$cardTitle} de {$listUserLogin} dans la liste {$listTitle} sur Listerr.</p>
                <br>
                <p>Si vous souhaitez retrouver votre réservation, merci de cliquer sur le lien ci-dessous :</p>
                <p><a href="{$domain}/list/pages/list.html?id={$listId}&GuestToken={$encryptGuestToken}">Lien pour l'annulation</a></p>
                <br>
                <p>Toute l'équipe de Listerr vous remercie et vous souhaite une bonne journée.</p>
                <br>
                <p>Cordialement.</p>
                <p>Administrateur de Listerr.</p>
                HTML;

            $AllRecipients = [];
            foreach ($allUsers as $user) {
                $AllRecipients[] = htmlspecialchars($user->email);
            }

            // Filtre l'email de l'admin
            $AllRecipients = $modelIncludes->seekAndDestroy('fagot.mathieu@gmail.com', $AllRecipients);
            // Filtre l'email du propriétaire
            $AllRecipients = $modelIncludes->seekAndDestroy($listUserEmail, $AllRecipients);
            // Filtre l'email du réservant du souhait
            $AllRecipients = $modelIncludes->seekAndDestroy($ReservationUserEmail, $AllRecipients);

            $subjectAll = 'Listerr - Nouvelle réservation sur une liste';
            $messageAll = <<< HTML
            <p>Bonjour à tous,</p>
            <br>
            <p>Pour information, le souhait "{$cardTitle}" de la liste "{$listTitle}" appartenant à {$listUserLogin} a été réservée par {$ReservationUserName}.</p>
            <p>Voici où la retrouver si besoin - <a href="{$domain}/list/pages/list.html?id={$listId}">lien vers la liste</a>.</p>
            <br>
            <p>Bonne journée.</p>
            <p>Administrateur de Listerr.</p>
            HTML;

            // Convertie une string en json_encode
            $strRecipient = json_encode($ReservationUserEmail);
            // Convertie l'array en json_encode
            $strAllRecipients = json_encode($AllRecipients);

            // Envoie un mail de confirmation à l'utilisateur qui réserve
            $mailForUser = $this->sendNotificationMailToUser($strRecipient, $subjectUser, $messageUser);
            // Envoie un mail d'informations de réservation aux autres utilisateurs
            $mailForOtherUsers = $this->sendNotificationMailToUser($strAllRecipients, $subjectAll, $messageAll);

            return [
                "status" => "success",
                "mailForUser" => json_decode($mailForUser, true),
                "mailForOtherUsers" => json_decode($mailForOtherUsers, true)
            ];

        } catch (\Exception $e) {
            return json_encode([
                "status" => "errors",
                "message" => $e->getMessage()
            ]);
        }
    }

/**
     * Cette méthode permet de récupérer les éléments pour construire la notification par mail d'information de MAJ
     * @param array|string $dataRecipients - Tableau d'adresses mails ou un seul mail
     * @param string $subject - Objet du mail
     * @param string $message - Corps du mail
     *
     * @return string - Réponse JSON : "sendMail" avec un message, en cas de succès.
     *                                 "no sendMail" avec un message d'erreur, en cas d'échec.
     *                                 "errors" avec un message d'erreur, en cas d'échec.
     *
     */
    public function getElementMailFeature(string $csrfToken, array|string $dataRecipients, string $subject, string $message): mixed
    {
        try {
            $validToken = $this->csrfToken->isValidToken($csrfToken, "mailForm");
            if (!$validToken) {
                return json_encode([
                    "status" => "fail",
                    "message" => "no valid csrfToken"
                ]);
            }

            $this->mailInit($subject, $message);

            $body =
                <<< HTML
                    <p>Chers/Chères membres de Listerr,</p>
                    <br>
                    <p>$message</p>
                    <br>
                    <p>Cdt, Admin de Listerr</p>
                HTML;

            $recipients = json_decode($dataRecipients, true);
            // Ajoute des destinataires principaux
            if (is_array($recipients)) {
                foreach ($recipients as $recipient) {
                    $this->mail->addAddress(trim($recipient));
                }
            } else if (is_string($recipients)) {
                $this->mail->addAddress(trim($recipients));
            }

            $this->mail->Body = $body;

            if ($this->mail->send()) {
                return json_encode([
                    "status" => "sendMail",
                    "message" => "le mail a bien été envoyé."
                ]);
            } else {
                return json_encode([
                    "status" => "no sendMail",
                    "message" => "le mail n'a pas été envoyé."
                ]);
            }

        } catch (\Exception $e) {
            return json_encode([
                "status" => "errors",
                "message" => $e->getMessage()
            ]);
        }
    }

    public function getElementMailFeatureToAdmin(array $params, int $userID): mixed
    {
        try {
            $users = new Users();
            $user = $users->readById($userID);
            $userLogin = $user->login;
            $userRecipient = $user->email;

            $typeFeature = htmlspecialchars($params['typeFeature']);
            $titleFeature = htmlspecialchars($params['titleFeature']);
            $descriptionFeature = htmlspecialchars($params['descriptionFeature']);

            // Convertie une string en json_encode
            $strRecipient = json_encode($userRecipient);

            // faire mail accusé de réception suggestion / bug
            $subjectUser = "Listerr - AR suggestion / bug auprès de l'Admin";
            $messageUser = <<< HTML
            <p>Bonjour {$userLogin},</p>
            <br>
            <p>Votre {$typeFeature} suivant a bien été transmis(e) à l'Admin de Listerr pour traitement : </p>
            <p> - Titre : <strong>{$titleFeature}</strong></p>
            <p> - Description : <em>"{$descriptionFeature}"</em></p>
            <br>
            <p>L'Admin pourra vous contactera par mail en cas de demande d'explications, si besoin.</p>
            <p>Dès que votre remontée sera traitée, un mail sera envoyé pour confirmation.</p>
            <p>En cas de bug, la ligne sera statuée "soldé".</p>
            <br>
            <p>Toute l'équipe de Listerr vous remercie pour votre contribution et vous souhaite une bonne journée.</p>
            <p>Cordialement,</p>
            <p>Administrateur de Listerr.</p>
            HTML;

            $subjectAdmin = <<< HTML
            Listerr - {$typeFeature} de {$userLogin}
            HTML;

            $messageAdmin = <<< HTML
            <h3>Titre : {$titleFeature}</h3>
            <p>Description : <strong>{$descriptionFeature}</strong>.</p>
            <p>Email de {$userLogin} : {$userRecipient}, en cas de réponse sur la faisabilité / pertinence.</p>
            <br>
            <p>Bonne journée.</p>
            <p>Administrateur de Listerr.</p>
            HTML;

            // Envoie un mail de confirmation de réception à l'utilisateur
            $mailForUser = $this->sendNotificationMailToUser($strRecipient, $subjectUser, $messageUser);
            // Envoie un mail d'informations de nouvelle suggestion / alerte de bug par un utilisateur à l'Admin
            $mailForAdmin = $this->sendNotificationMailToAdmin($subjectAdmin, $messageAdmin);

            return [
                "status" => "success",
                "mailForUser" => json_decode($mailForUser, true),
                "mailForAdmin" => json_decode($mailForAdmin, true)
            ];

        } catch (\Exception $e) {
            return json_encode([
                "status" => "errors",
                "message" => $e->getMessage()
            ]);
        }
    }
    /**
     * Cette méthode permet de récupérer les éléments pour construire la notification d'annulation de la réservation par mail
     * @param array $params - Tableau contenant les informations nécessaires :
     *                      - 'list_id' (int) : L'identifiant de la liste.
     *                      - 'card_id' (int) : L'identifiant de la tâche/carte.
     *                      - Autres paramètres requis pour la création d'une réservation.
     *
     * @return bool - Vrai si mail envoyé
     * @return bool - Faux si mail pas envoyé
     * @return string - Réponse JSON : "errors" avec un message d'erreur, en cas d'échec.
     *
     */
    public function getElementMailDeleteReservation($reservation)
    {
        try {
            $users = new Users();
            $allUsers = $users->readAll();

            $listId = htmlspecialchars($reservation->listId);
            $cardId = htmlspecialchars($reservation->cardId);
            $ReservationUserEmail = htmlspecialchars($reservation->email);

            $AllRecipients = [];
            foreach ($allUsers as $user) {
                $AllRecipients[] = $user->email;
            }

            $modelLists = new Lists();
            $lists = $modelLists->getOneListById($listId);
            $listUserEmail = htmlspecialchars($lists->user->email);

            $modelCards = new Cards();
            $cards = $modelCards->getOneCardById($cardId);

            $listTitle = htmlspecialchars($lists->title);
            $listUserLogin = htmlspecialchars($lists->user->login);
            $cardTitle = htmlspecialchars($cards->title);

            $modelIncludes = new Includes();
            $domain = $modelIncludes->changeDomain();

            // Filtre l'email de l'admin
            $AllRecipients = $modelIncludes->seekAndDestroy('fagot.mathieu@gmail.com', $AllRecipients);
            // Filtre l'email du propriétaire
            $AllRecipients = $modelIncludes->seekAndDestroy($listUserEmail, $AllRecipients);
            // Filtre l'email du réservant du souhait
            $AllRecipients = $modelIncludes->seekAndDestroy($ReservationUserEmail, $AllRecipients);

            $subjectAll = <<< HTML
                Listerr - Annulation de réservation d'un souhait
                HTML;
            $messageAll = <<< HTML
            <p>Bonjour à tous,</p>
            <br>
            <p>Pour information, le souhait "{$cardTitle}" de la liste "{$listTitle}" appartenant à {$listUserLogin} est de nouveau réservable.</p>
            <p>Voici où le retrouver si besoin - <a href="{$domain}/list/pages/list.html?id={$listId}">lien vers l'article</a>.</p>
            <br>
            <p>Bonne journée.</p>
            <p>Administrateur de Listerr.</p>
            HTML;

            // Convertie l'array en json_encode
            $strAllRecipients = json_encode($AllRecipients);
            $mailForAllUsers = $this->sendNotificationMailToUser($strAllRecipients, $subjectAll, $messageAll);

            return [
                "status" => "success",
                "mailForAllUsers" => json_decode($mailForAllUsers, true)
            ];

        } catch (\Exception $e) {
            return json_encode([
                "status" => "errors",
                "message" => $e->getMessage()
            ]);
        }
    }
}