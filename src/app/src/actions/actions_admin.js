"use strict";

import { configPath } from "../services/utils.js";

/**
 * Effectue une requête pour récupérer la liste de tous les utilisateurs depuis l'API.
 *
 * @returns {Promise<Object|null>} Une promesse résolue avec les données des utilisateurs ou null en cas d'erreur.
 */
async function fetchReadAll() {
    try {
        const url = `${configPath.apiPath}/?route=admin_read_users`;
        return await fetch(url, {
            method: "GET",
        }).then((response) => response.json());
    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
}

async function fetchUpdateUser(form, id) {
    try {
        const formData = new FormData(form);
        formData.append('id', id);

        const url = `${configPath.apiPath}/?route=admin_update_user`;
        return await fetch(url, {
            method: "POST",
            headers: {
                "X-Authorization": localStorage.getItem("token"),
                "X-CSRFToken": localStorage.getItem("csrfToken")
            },
            body: formData,
            }).then(response => response.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
}

async function fetchDeleteUser(id) {
    try {
        const formData = new FormData();
        formData.append("id", id);
        const url = `${configPath.apiPath}/?route=admin_delete_user`;
        return await fetch(url, {
            method: "POST",
            headers: { X-Authorization: localStorage.getItem("token") },
            body: formData,
        }).then((response) => response.json());
    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
}

export { fetchReadAll, fetchUpdateUser, fetchDeleteUser };
