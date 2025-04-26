"use strict";

import { configPath } from "./utils.js";

/**
 * Effectue une requête pour obtenir un jeton CSRF depuis le serveur.
 *
 * @param {string} formId - L'ID du formulaire pour lequel un jeton CSRF doit être obtenu
 * @returns {Promise} Une promesse qui résout avec le résultat de la requête.
 */
async function fetchCSRF(formId) {
    try {

        const formData = new FormData();
        formData.append("formId", formId);
        const url = `${configPath.apiPath}/?route=csrf`;
        return await fetch(url, {
            method: "POST",
            body: formData
        })
        .then(response => response.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
}

/**
 * Obtient un jeton CSRF en appelant la fonction fetchCSRF et le stocke localement.
 *
 * @param {string} formId - L'ID du formulaire pour lequel un jeton CSRF doit être obtenu.
 */
function CSRFToken(formId) {
    fetchCSRF(formId)
    .then(response => {
        if (response.status === "success csrfToken") {
            localStorage.setItem("csrfToken", response.csrfToken);
        };
    });
}

export { CSRFToken };