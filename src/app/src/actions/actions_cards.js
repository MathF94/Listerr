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

/**
 * Effectue une requête pour mettre à jour une carte en utilisant un formulaire.
 *
 * @param {HTMLFormElement} form - Le formulaire contenant les données mises à jour de la liste.
 * @param {number} id - L'identifiant de la carte à mettre à jour.
 * @returns {Promise<Object|null>} Une promesse résolue avec les données de la carte mise à jour ou null en cas d'erreur.
 */
async function fetchUpdateCard(form, id) {
    try {
        const formData = new FormData(form);
        formData.append('id', id);

        const url = `${configPath.apiPath}/?route=update_card`;
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
};

async function fetchUpdateReservation(checked, id) {
    try {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('checked', checked);

        const url = `${configPath.apiPath}/?route=update_checked`;
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
/**
 * Effectue une requête pour supprimer une carte par son ID.
 *
 * @param {number} id - L'identifiant de la carte à supprimer.
 * @returns {Promise<Object|null>} Une promesse résolue avec les données de la suppression ou null en cas d'erreur.
 */
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
    fetchUpdateCard,
    fetchUpdateReservation,
    fetchDeleteCard
};