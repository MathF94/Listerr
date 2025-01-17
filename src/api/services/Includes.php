<?php

namespace Services;

Class Includes
{
    public function changeDomain(): string
    {
        if (in_array('http://localhost', [$_SERVER['HTTP_HOST'], $_SERVER['HTTP_REFERER'], $_SERVER['HTTP_ORIGIN']], true)) {
            return $domain = "http://localhost/listerr/src/app/src";
        } else {
            return $domain = "https://listerr.tea-tux.fr";
        }
    }

    public function seekAndDestroy($EmailTarget, $AllEmails): array
    {
        $index = array_search($EmailTarget, $AllEmails);
            // Recherche l'index lié au mail ciblé dans le tableau d'emails
            if ($index !== false) {
                // Supprimer la valeur liée à cet index
                array_splice($AllEmails, $index, 1);
            }
            return $AllEmails;
    }
}