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
 * Effectue une requête pour créer une nouvelle carte en utilisant un formulaire.
 *
 * @param {HTMLFormElement} form - Le formulaire contenant les données de la nouvelle carte.
 * @returns {Promise<Object|null>} Une promesse résolue avec les données de la carte créée ou null en cas d'erreur.

 * @param {number} id - L'identifiant de la carte à mettre à jour.
 * @returns {Promise<Object|null>} Une promesse résolue avec les données de la carte mise à jour ou null en cas d'erreur.
 */
async function fetchCreateReservation(form, listId, cardId) {
    try {
        const formData = new FormData(form);
        formData.append('list_id', listId);
        formData.append('card_id', cardId);

        const url = `${configPath.apiPath}/?route=create_reservation`;
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

async function fetchReadAllReservationsByCard(id) {
    try {
        const url = `${configPath.apiPath}/?route=read_one_reservation_by_id`;
        return await fetch(`${url}&id=${id}`, {
            headers: {"X-Authorization": localStorage.getItem("token") || ""},
            method: "GET",
            }).then(response => response?.json());

    } catch (error) {
        console.error("Erreur lors de la requête fetch :", error);
        return null;
    }
}

async function fetchUpdatePriority(priority, id) {
    try {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('priority', priority);

        const url = `${configPath.apiPath}/?route=update_priority`;
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

async function fetchCancelReservation(id) {
    try {
        const formData = new FormData();
        formData.append('id', id);

        const url = `${configPath.apiPath}/?route=cancel_reservation`;
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
    fetchCreateReservation,
    fetchReadAllReservationsByCard,
    fetchUpdatePriority,
    fetchCancelReservation
}