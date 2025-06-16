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