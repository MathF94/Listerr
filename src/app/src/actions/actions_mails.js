"use strict";

import { configPath } from "../services/utils.js";

/**
 * Effectue une requête pour envoyer les paramètres d'un email depuis l'API.
 *
 * @returns {Promise<Object|null>} Une promesse résolue avec les données des utilisateurs ou null en cas d'erreur.
 */
async function fetchSendMailCard(form, listId) {
    try {
        const formData = new FormData(form);
        formData.append('listId', listId);
        const url = `${configPath.apiPath}/?route=send_mail_card`;
        return await fetch(url, {
            headers: {
                "X-Authorization": localStorage.getItem("token"),
                "X-CSRFToken": localStorage.getItem("csrfToken")
            },
            method: "POST",
            body: formData,
        }).then((response) => response.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
}

/**
 * Effectue une requête pour envoyer les paramètres d'un email depuis l'API.
 *
 * @returns {Promise<Object|null>} Une promesse résolue avec les données des utilisateurs ou null en cas d'erreur.
 */
async function fetchSendMailFeature(form) {
    try {
        const url = `${configPath.apiPath}/?route=send_mail_feature`;
        return await fetch(url, {
            headers: {
                "X-Authorization": localStorage.getItem("token"),
                "X-CSRFToken": localStorage.getItem("csrfToken")
            },
            method: "POST",
            body: new FormData(form),
        }).then((response) => response.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
}

export { fetchSendMailCard, fetchSendMailFeature };
