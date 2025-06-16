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
            headers: { "X-Authorization": localStorage.getItem("token") },
            body: formData,
        }).then((response) => response.json());
    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
}

export {
    fetchReadAll,
    fetchUpdateUser,
    fetchDeleteUser
};
