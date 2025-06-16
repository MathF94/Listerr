/*
 * listerr - gestionnaire de listes et tâches
 * Copyright (C) 2025 Mathieu Fagot
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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