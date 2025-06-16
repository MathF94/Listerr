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

"use strict";

import { configPath, redirect } from "../services/utils.js";

const urlParams = new URLSearchParams(document.location);
const pathname = urlParams.get("pathname");
const test = "home/pages/home.html";

if (!pathname.match(test)) {
    localStorage.nav_active ="home";
    redirect(`${configPath.basePath}/home/pages/home.html`, 0);
}

/**
 * Effectue une requête pour récupérer la liste de toutes les listes de tous les utilisateurs depuis l'API.
 *
 * @returns {Promise<Object|null>} Une promesse résolue avec les données des listes ou null en cas d'erreur.
 */
async function fetchAllListsByUsers() {
    try {
        const url = `${configPath.apiPath}/?route=read_all_lists_all_users`;

        return await fetch(url, {
            method: "GET",
            headers: {"X-Authorization": localStorage.getItem("token") || ""},
            })
            .then(response => response.json())

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
};

export { fetchAllListsByUsers };
