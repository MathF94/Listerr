<?php

namespace Services;

use Models\SendMails;
use PHPMailer\PHPMailer\PHPMailer;

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

        $this->mail = new PHPMailer(true);
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
    public function sendReservationMail(string $recipient, string $subject, string $message): mixed
    {
        try {
            $configSMTPDecode = json_decode($this->configSMTP["config"]);
            // $mail->SMTPDebug = SMTP::DEBUG_SERVER;                         // Active le debuggage dans la console
            $this->mail->isSMTP();                                            // Send using SMTP
            $this->mail->Host       = $configSMTPDecode->smtp;                // Set the SMTP server to send through
            $this->mail->SMTPAuth   = true;                                   // Enable SMTP authentication
            $this->mail->Username   = $configSMTPDecode->username;            // SMTP username
            $this->mail->Password   = $configSMTPDecode->password;            // SMTP password
            $this->mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;         // Enable implicit TLS encryption
            $this->mail->Port       = 587;

            // Recipients (From, To, Copy)
            $this->mail->setFrom($configSMTPDecode->username, 'Admin Listerr');       // Définit l’expéditeur
            $this->mail->addAddress($recipient);                                      // Ajoute des destinataires principaux
            $this->mail->addReplyTo($configSMTPDecode->username, 'Contact');          // Définit l’adresse pour les réponses
            // $mail->addCC('cc@example.com');                                  // Destinataire en copie
            // $mail->addBCC('bcc@example.com');                                // Destinataire en copie cachée

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
}