"use strict"

import { configPath } from "../services/utils.js";

/**
 * Effectue une requête pour créer (inscrire) un nouvel utilisateur en utilisant un formulaire.
 *
 * @param {HTMLFormElement} form - Le formulaire contenant les données d'inscription.
 * @returns {Promise<Object|null>} Une promesse résolue avec les données de l'utilisateur inscrit ou null en cas d'erreur.
 */
async function fetchRegister(form) {
    try {
        const url = `${configPath.apiPath}/?route=user_register`;
        return await fetch(url, {
            method: "POST",
            headers: {
                "X-CSRFToken": localStorage.getItem("csrfToken")
            },
            body: new FormData(form)
        }).then(response => response.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
};

/**
 * Effectue une requête pour authentifier un utilisateur en utilisant un formulaire de connexion.
 *
 * @param {HTMLFormElement} form - Le formulaire contenant les données de connexion.
 * @returns {Promise<Object|null>} Une promesse résolue avec les données de l'utilisateur authentifié ou null en cas d'erreur.
 */
async function fetchLogin(form) {
    try {
        const url = `${configPath.apiPath}/?route=user_login`;
        return await fetch(url, {
            method: "POST",
            headers: {
                "X-CSRFToken": localStorage.getItem("csrfToken")
            },
            body: new FormData(form)
        }).then(response => response.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
};

/**
 * Effectue une requête pour récupérer les données du profil de l'utilisateur actuellement authentifié.
 *
 * @returns {Promise<Object|null>} Une promesse résolue avec les données du profil de l'utilisateur ou null en cas d'erreur.
 */
async function fetchRead(id) {
    try {
        let url = `${configPath.apiPath}/?route=user_profil`;
        if(id) {
            url += `&id=${id}`;
        }
        return await fetch(url, {
            method: "GET",
            headers: {"X-Authorization": localStorage.getItem("token")},
            }).then(response => response.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
};

/**
 * Effectue une requête pour déconnecter l'utilisateur actuellement authentifié.
 *
 * @returns {Promise<Object|null>} Une promesse résolue avec les données de la déconnexion ou null en cas d'erreur.
 */
async function fetchLogout() {
    try {
        const url = `${configPath.apiPath}/?route=user_logout`;
        return await fetch(url, {
            method: "POST",
            headers: {"X-Authorization": localStorage.getItem("token")},
        }).then(response => response.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
};

/**
 * Effectue une requête pour mettre à jour les informations de l'utilisateur actuellement authentifié en utilisant un formulaire.
 *
 * @param {HTMLFormElement} form - Le formulaire contenant les données de mise à jour du profil de l'utilisateur.
 * @returns {Promise<Object|null>} Une promesse résolue avec les données de l'utilisateur mis à jour ou null en cas d'erreur.
 */
async function fetchUpdate(form) {
    try {
        const url = `${configPath.apiPath}/?route=user_update`;
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
 * Effectue une requête pour supprimer le compte de l'utilisateur actuellement authentifié.
 *
 * @returns {Promise<Object|null>} Une promesse résolue avec les données de la suppression du compte ou null en cas d'erreur.
 */
async function fetchDelete(id) {
    try {
        let url = `${configPath.apiPath}/?route=user_delete`;
        if(id) {
            url += `&id=${id}`;
        }
        return await fetch(url, {
            method: "POST",
            headers: {"X-Authorization": localStorage.getItem("token")},
            }).then(response => response.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
};

export {
    fetchRegister,
    fetchLogin,
    fetchRead,
    fetchLogout,
    fetchUpdate,
    fetchDelete,
};