"use strict"

import { configPath } from "../services/config.js";

async function fetchRegister(form) {
    try {
        const url = `${configPath.apiPath}/?route=user_register`;
        return await fetch(url, {
            headers: {
                "X-CSRFToken": localStorage.getItem("csrfToken")
            },
            method: "POST",
            body: new FormData(form)
        }).then(response => response.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
}

async function fetchLogin(form) {
    try {
        const url = `${configPath.apiPath}/?route=user_login`;
        return await fetch(url, {
            headers: {
                "X-CSRFToken": localStorage.getItem("csrfToken")
            },
            method: "POST",
            body: new FormData(form)
        }).then(response => response.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
}

async function fetchRead() {
    try {
        const url = `${configPath.apiPath}/?route=user_profil`;
        return await fetch(url, {
            method: "GET",
            headers: {"Authorization": localStorage.getItem("token")},
            }).then(response => response.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
};

async function fetchLogout() {
    try {
        const url = `${configPath.apiPath}/?route=user_logout`;
        return await fetch(url, {
            method: "POST",
            headers: {"Authorization": localStorage.getItem("token")},
        }).then(response => response.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
};

async function fetchUpdate(form) {
    try {
        const url = `${configPath.apiPath}/?route=user_update`;
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
};

async function fetchDelete() {
    try {
        const url = `${configPath.apiPath}/?route=user_delete`;
        return await fetch(url, {
            method: "POST",
            headers: {"Authorization": localStorage.getItem("token")},
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