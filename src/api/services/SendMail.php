<?php

namespace Services;

use Models\Cards;
use Models\Lists;
use Models\Reservations;
use Models\SendMails;
use Models\Users;
use PHPMailer\PHPMailer\PHPMailer;
use services\Includes;
use Services\Session;

/**
 * Classe pour l'envoi des mail
 */

class SendMail
{
    private $modelSendMails;
    private $mail;
    private $configSMTP;

    public function __construct()
    {
        $idMail = 1;
        $this->modelSendMails = new SendMails();
        $this->configSMTP = $this->modelSendMails->getConfigMailById($idMail);
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
    public function sendNotificationMailToUser(array|string $recipient, string $subject, string $message): mixed
    {
        try {
            $configSMTPDecode = json_decode($this->configSMTP["config"]);
            $this->mail = new PHPMailer(true);
            // $mail->SMTPDebug = SMTP::DEBUG_SERVER;                           // Active le debuggage dans la console
            $this->mail->isSMTP();                                              // Send using SMTP
            $this->mail->Host       = $configSMTPDecode->smtp;                  // Set the SMTP server to send through
            $this->mail->SMTPAuth   = true;                                     // Enable SMTP authentication
            $this->mail->Username   = $configSMTPDecode->username;              // SMTP username
            $this->mail->Password   = $configSMTPDecode->password;              // SMTP password
            $this->mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;           // Enable implicit TLS encryption
            $this->mail->Port       = 587;

            // Recipients (From, To, Copy)
            $this->mail->setFrom($configSMTPDecode->username, 'Admin Listerr'); // Définit l’expéditeur

            // $this->mail->addAddress($recipient);                             // Ajoute des destinataires principaux
            if (is_array($recipient)) {                                         // Vérifie si c'est un tableau de plusieurs contacts
                foreach ($recipient as $email) {
                    $this->mail->addAddress(trim($email));
                }
            } else if (is_string($recipient)) {                                 // Vérifie si c'est une string pour un seul contact
                $this->mail->addAddress(trim($recipient));

            }
            $this->mail->addReplyTo($configSMTPDecode->username, 'Admin Listerr');    // Définit l’adresse pour les réponses
            // $mail->addCC('cc@example.com');                                        // Destinataire en copie
            // $mail->addBCC('bcc@example.com');                                      // Destinataire en copie cachée

            $this->mail->isHTML(true);           //Set email format to HTML
            $this->mail->Subject = $subject;
            $this->mail->Body = $message;
            $this->mail->CharSet = 'UTF-8';

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
    public function sendNotificationMailToAdmin(string $subject, string $message): mixed
    {
        try {
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
            $this->mail->setFrom($configSMTPDecode->username, 'Admin Listerr');    // Définit l’adresse pour les réponses
            $this->mail->addAddress($configSMTPDecode->username, 'Admin Listerr');      // Ajoute des destinataires principaux
            $this->mail->addCC('julien@tea-tux.fr');                               // Destinataire en copie
            // $mail->addBCC('bcc@example.com');                                   // Destinataire en copie cachée

            $this->mail->isHTML(true);                                             //Set email format to HTML
            $this->mail->Subject = $subject;
            $this->mail->Body = $message;
            $this->mail->CharSet = 'UTF-8';

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
     * (nom de propriétaire de liste, nom de la liste, nom du souhait / tâche)
     *
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
            $recipient = htmlspecialchars($params['email']);

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
                <p>Cordialement.</p>
                <p>Administrateur de Listerr.</p>
                HTML;

            $subjectAdmin = `Listerr - Confirmation d'inscription`;
            $messageAdmin = <<< HTML
                <p>Bonjour Math & Julien !</p>
                <br>
                <p>Pour information, un nouvel utilisateur s'est inscrit : </p>
                <p> - Nom : {$name} ; </p>
                <p> - Prénom : {$firstname} ; </p>
                <p> - Login : {$login} ; </p>
                <p> - Email : {$recipient} ; </p>
                <br>
                <p>Bonne journée.</p>
                <p>Administrateur de Listerr.</p>
            HTML;

            $modelSendMails = new SendMail();
            $mailForUser = $modelSendMails->sendNotificationMailToUser($recipient, $subjectUser, $messageUser);
            $mailForAdmin = $modelSendMails->sendNotificationMailToAdmin($subjectAdmin, $messageAdmin);

            if ($mailForUser) {
                if ($mailForAdmin) {
                    return true;
                }
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

    public function getElementMailList(array $params, object $user)
    {
        try {
            $users = new Users();
            $allUsers = $users->readAll();

            $listTitle = $params['titleList'];
            $listUserLogin = $user->login;
            $AllRecipients = [];
            foreach ($allUsers as $user) {
                $AllRecipients[] = $user->email;
            }

            $subjectAll = <<< HTML
            Listerr - Nouvelle création de liste par {$listUserLogin}
            HTML;
            $messageAll = <<< HTML
            <p>Bonjour à tous,</p>
            <br>
            <p>Pour information, une nouvelle liste "{$listTitle}" appartenant à {$listUserLogin} vient d'être créée.</p>
            <br>
            <p>Bonne journée.</p>
            <p>Administrateur de Listerr.</p>
            HTML;

            $modelSendMails = new SendMail();
            $mailForAllUsers = $modelSendMails->sendNotificationMailToUser($AllRecipients, $subjectAll, $messageAll);

            if ($mailForAllUsers) {
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

    public function getElementMailCard($params)
    {
        try {
            $users = new Users();
            $allUsers = $users->readAll();

            $AllRecipients = [];
            foreach ($allUsers as $user) {
                $AllRecipients[] = $user->email;
            }

            $listId = urlencode($params['list_id']);

            $modelLists = new Lists();
            $lists = $modelLists->getOneListById($listId);

            $listTitle = htmlspecialchars($lists->title);
            $listUserLogin = htmlspecialchars($lists->user->login);
            $cardTitle = htmlspecialchars($params['titleCard']);

            $modelIncludes = new Includes();
            $domain = $modelIncludes->changeDomain();

            $subjectAll = <<< HTML
                Listerr - Nouvelle création de liste par {$listUserLogin};
                HTML;
            $messageAll = <<< HTML
            <p>Bonjour à tous,</p>
            <br>
            <p>Pour information, un nouvel article "{$cardTitle}" de la liste "{$listTitle}" appartenant à {$listUserLogin} vient d'être créée.</p>
            <p>Voici où la retrouver si besoin - <a href="{$domain}/list/pages/list.html?id={$listId}">lien vers l'article</a>.</p>
            <br>
            <p>Bonne journée.</p>
            <p>Administrateur de Listerr.</p>
            HTML;

            $modelSendMails = new SendMail();
            $mailForAllUsers = $modelSendMails->sendNotificationMailToUser($AllRecipients, $subjectAll, $messageAll);

            if ($mailForAllUsers) {
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
     * Cette méthode permet de récupérer les éléments pour construire la notification de réservation par mail
     * (nom de propriétaire de liste, nom de la liste, nom du souhait / tâche)
     *
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
    public function getElementMailReservation($params): mixed
    {
        try {
            $session = new Session();
            $encryptGuestToken = urlencode($session->encryptGuestToken($params['name'], $params['email'], $params['list_id'], $params['card_id']));

            $users = new Users();
            $allUsers = $users->readAll();

            $modelReservations = new Reservations();
            $modelReservations->createReservation($params);

            $modelLists = new Lists();
            $lists = $modelLists->getOneListById($params['list_id']);

            $modelCards = new Cards();
            $cards = $modelCards->getOneCardById($params['card_id']);

            $name = htmlspecialchars($params['name']);
            $recipient = htmlspecialchars($params['email']);

            $listUserLogin = htmlspecialchars($lists->user->login);
            $listTitle = htmlspecialchars($lists->title);
            $cardTitle = htmlspecialchars($cards->title);
            $listId = urlencode($params['list_id']);

            $modelIncludes = new Includes();
            $domain = $modelIncludes->changeDomain();

            $subjectUser = 'Listerr - Votre réservation a bien été prise en compte';
            $messageUser = <<< HTML
                <p>Bonjour {$name},</p>
                <br>
                <p>Nous vous confirmons avoir bien pris en compte la réservation de {$cardTitle} dans la liste {$listTitle} de {$listUserLogin} sur Listerr.</p>
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
                $AllRecipients[] = $user->email;
            }

            $indexOwner = array_search($lists->user->email, $AllRecipients);
            // Si l'email du propriétaire de la liste existe dans le tableau (index !== false)
            if ($indexOwner !== false) {
                // Supprimer l'élément à cet index
                array_splice($AllRecipients, $indexOwner, 1);
            }

            $indexReserver = array_search($recipient, $AllRecipients);
            // Si l'email du propriétaire de la liste existe dans le tableau (index !== false)
            if ($indexReserver !== false) {
                // Supprimer l'élément à cet index
                array_splice($AllRecipients, $indexReserver, 1);
            }

            $subjectAll = 'Listerr - Nouvelle réservation sur une liste';
            $messageAll = <<< HTML
            <p>Bonjour à tous,</p>
            <br>
            <p>Pour information, la carte "{$cardTitle}" de la liste "{$listTitle}" appartenant à {$listUserLogin} a été réservée par {$name}.</p>
            <p>Voici où la retrouver si besoin - <a href="{$domain}/list/pages/list.html?id={$listId}">lien vers la liste</a>.</p>
            <br>
            <p>Bonne journée.</p>
            <p>Administrateur de Listerr.</p>
            HTML;

            $modelSendMails = new SendMail();
            $mailForRecipient = $modelSendMails->sendNotificationMailToUser($recipient, $subjectUser, $messageUser);
            $mailForOthersUsers = $modelSendMails->sendNotificationMailToUser($AllRecipients, $subjectAll, $messageAll);

            if ($mailForRecipient) {
                if ($mailForOthersUsers) {
                    return true;
                }
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
}