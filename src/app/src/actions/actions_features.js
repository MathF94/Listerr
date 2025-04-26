"use strict";

import { configPath } from "../services/utils.js";

/**
 * Effectue une requête pour créer une nouvelle feature en utilisant un formulaire.
 *
 * @param {HTMLFormElement} form - Le formulaire contenant les données de la nouvelle feature.
 * @returns {Promise<Object|null>} Une promesse résolue avec les données de la feature créée ou null en cas d'erreur.
 */
async function fetchCreateFeature(form) {
    try {
        const url = `${configPath.apiPath}/?route=create_feature`;
        return await fetch(url, {
            headers: {
                "X-Authorization": localStorage.getItem("token"),
                "X-CSRFToken": localStorage.getItem("csrfToken")
            },
            method: "POST",
            body: new FormData(form),
            }).then(response => response.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
};

/**
 * Effectue une requête pour récupérer la liste de tous les utilisateurs depuis l'API.
 *
 * @returns {Promise<Object|null>} Une promesse résolue avec les données des utilisateurs ou null en cas d'erreur.
 */
async function fetchReadAllFeatures() {
    try {
        const url = `${configPath.apiPath}/?route=read_all_features`;
        return await fetch(url, {
            headers: {
                "X-Authorization": localStorage.getItem("token"),
            },
            method: "GET",
        }).then((response) => response.json());
    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
}

/**
 * Effectue une requête pour mettre à jour une feature en utilisant un formulaire.
 *
 * @param {HTMLFormElement} form - Le formulaire contenant les données mises à jour de la feature.
 * @param {number} id - L'identifiant de la feature à mettre à jour.
 * @returns {Promise<Object|null>} Une promesse résolue avec les données de la feature mise à jour ou null en cas d'erreur.
 */
async function fetchUpdateFeature(form, id) {
    try {
        const formData = new FormData(form);
        formData.append('id', id);
        const url = `${configPath.apiPath}/?route=update_feature`;
        return await fetch(url, {
            headers: {
                "X-Authorization": localStorage.getItem("token"),
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
 * Effectue une requête pour mettre à jour une feature en utilisant un formulaire.
 *
 * @param {HTMLFormElement} form - Le formulaire contenant les données mises à jour de la feature.
 * @param {number} id - L'identifiant de la feature à mettre à jour.
 * @returns {Promise<Object|null>} Une promesse résolue avec les données de la feature mise à jour ou null en cas d'erreur.
 */
async function fetchUpdateStatusFeature(id, status) {
    try {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('statusFeature', status);
        const url = `${configPath.apiPath}/?route=update_status_feature`;
        return await fetch(url, {
            headers: {
                "X-Authorization": localStorage.getItem("token")
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
 * Effectue une requête pour supprimer une feature par son ID.
 *
 * @param {number} id - L'identifiant de la feature à supprimer.
 * @returns {Promise<Object|null>} Une promesse résolue avec les données de la suppression ou null en cas d'erreur.
 */
async function fetchDeleteFeature(id) {
    try {
        const formData = new FormData();
        formData.append('id', id);

        const url = `${configPath.apiPath}/?route=delete_feature`;
        return await fetch(url, {
            headers: {"X-Authorization": localStorage.getItem("token")},
            method: "POST",
            body: formData
            }).then(response => response.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
}


export {
    fetchCreateFeature,
    fetchReadAllFeatures,
    fetchUpdateFeature,
    fetchUpdateStatusFeature,
    fetchDeleteFeature
}
