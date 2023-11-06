"use strict";

import { configPath } from "../services/utils.js";

/**
 * Effectue une requête pour créer une nouvelle carte en utilisant un formulaire.
 *
 * @param {HTMLFormElement} form - Le formulaire contenant les données de la nouvelle carte.
 * @returns {Promise<Object|null>} Une promesse résolue avec les données de la carte créée ou null en cas d'erreur.
 */
async function fetchCreateCard(form, listId) {
    try {
        const formData = new FormData(form);
        formData.append('list_id', listId);

        const url = `${configPath.apiPath}/?route=create_card`;
        return await fetch(url, {
            headers: {
                "Authorization": localStorage.getItem("token"),
                "X-CSRFToken": localStorage.getItem("csrfToken")
            },
            method: "POST",
            body: formData,
            }).then(response => response.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
}

async function fetchReadAllCardsByList(id) {
    try {
        const url = `${configPath.apiPath}/?route=read_one_list_by_id`;
        return await fetch(`${url}&id=${id}`, {
            headers: {"Authorization": localStorage.getItem("token") || ""},
            method: "GET",
            }).then(response => response.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
}


async function fetchDeleteCard(id){
    try {
        const formData = new FormData();
        formData.append('id', id);

        const url = `${configPath.apiPath}/?route=delete_card`;
        return await fetch(url, {
            headers: {"Authorization": localStorage.getItem("token")},
            method: "POST",
            body: formData
            }).then(response => response.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
}
export {
    fetchCreateCard,
    fetchReadAllCardsByList,
    fetchDeleteCard
};