"use strict";

import { configPath } from "../services/utils.js";

/**
 * Effectue une requête pour créer une nouvelle liste en utilisant un formulaire.
 *
 * @param {HTMLFormElement} form - Le formulaire contenant les données de la nouvelle liste.
 * @returns {Promise<Object|null>} Une promesse résolue avec les données de la liste créée ou null en cas d'erreur.
 */
async function fetchCreateList(form) {
    try {
        const url = `${configPath.apiPath}/?route=create_list`;
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
 * Effectue une requête pour récupérer une liste spécifique par son ID pour list.html
 *
 * @param {number} id - L'identifiant de la liste à récupérer.
 * @returns {Promise<Object|null>} Une promesse résolue avec les données de la liste ou null en cas d'erreur.
 */
async function fetchReadOneListById(id) {
    try {
        const url = `${configPath.apiPath}/?route=read_one_list_by_id`;
        return await fetch(`${url}&id=${id}`, {
            headers: {"X-Authorization": localStorage.getItem("token") || ""},
            method: "GET",
            }).then(response => response.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
};

/**
 * Effectue une requête pour récupérer toutes les listes d'un utilisateur pour lists.html
 *
 * @returns {Promise<Object|null>} Une promesse résolue avec les données de toutes les listes de l'utilisateur ou null en cas d'erreur.
 */
async function fetchReadAllLists(id) {
    try {
        let url = `${configPath.apiPath}/?route=read_all_lists_by_user`;
        if (id) {
            url += `&id=${id}`;
        }
        return await fetch(url, {
            headers: {"X-Authorization": localStorage.getItem("token")},
            method: "GET",
            }).then(response => response.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
};

/**
 * Effectue une requête pour mettre à jour une liste en utilisant un formulaire.
 *
 * @param {HTMLFormElement} form - Le formulaire contenant les données mises à jour de la liste.
 * @param {number} id - L'identifiant de la liste à mettre à jour.
 * @returns {Promise<Object|null>} Une promesse résolue avec les données de la liste mise à jour ou null en cas d'erreur.
 */
async function fetchUpdateList(form, id) {
    try {
        const formData = new FormData(form);
        formData.append('id', id);

        const url = `${configPath.apiPath}/?route=update_list`;
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
};

/**
 * Effectue une requête pour supprimer une liste par son ID.
 *
 * @param {number} id - L'identifiant de la liste à supprimer.
 * @returns {Promise<Object|null>} Une promesse résolue avec les données de la suppression ou null en cas d'erreur.
 */
async function fetchDeleteList(id) {
    try {
        const formData = new FormData();
        formData.append('id', id);

        const url = `${configPath.apiPath}/?route=delete_list`;
        return await fetch(url, {
            headers: {"X-Authorization": localStorage.getItem("token")},
            method: "POST",
            body: formData
            }).then(response => response.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
};

export {
    fetchCreateList,
    fetchReadOneListById,
    fetchReadAllLists,
    fetchUpdateList,
    fetchDeleteList
};
