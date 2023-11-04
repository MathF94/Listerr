"use strict";

import { configPath } from "../services/utils.js";

/**
 * Effectue une requête pour créer une nouvelle carte en utilisant un formulaire.
 *
 * @param {HTMLFormElement} form - Le formulaire contenant les données de la nouvelle carte.
 * @returns {Promise<Object|null>} Une promesse résolue avec les données de la carte créée ou null en cas d'erreur.
 */
async function fetchCreateCard(form) {
    try {
        const url = `${configPath.apiPath}/?route=create_card`;
        return await fetch(url, {
            headers: {
                "Authorization": localStorage.getItem("token"),
                "X-CSRFToken": localStorage.getItem("csrfToken")
            },
            method: "POST",
            body: new FormData(form),
            }).then(response => response.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
}

export { fetchCreateCard };