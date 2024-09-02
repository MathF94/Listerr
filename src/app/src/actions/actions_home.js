"use strict";

import { configPath, redirect } from "../services/utils.js";

const urlParams = new URLSearchParams(document.location);
const pathname = urlParams.get("pathname");
const test = "home/pages/home.html";

if(!pathname.match(test)) {
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
