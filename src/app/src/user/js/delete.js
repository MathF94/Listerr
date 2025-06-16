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

import { fetchDelete } from "../../actions/actions_user.js";

import {
    configPath,
    redirect,
    dialog
} from "../../services/utils.js";

/**
 * Supprime le compte de l'utilisateur.
 */
function deleteUser() {
    const urlParams = new URLSearchParams(document.location.search);
    const deleteBtn = document.querySelector('#delete');
    deleteBtn.addEventListener('click', function(e){
        e.preventDefault();
        if (urlParams.has("id")) {
            // Obtient l'identifiant de l'utilisateur à partir des paramètres de l'URL.
            const id = urlParams.get("id");
        }

        if (urlParams.size === 0) {
            if (e.target.value === 'delete'){
                if (confirm('Voulez-vous vraiment vous supprimer votre compte ?') === true) {
                    fetchDelete()
                    .then(() => {
                        dialog({title: "Suppression de compte",
                                content: `<p>Votre compte a bien été supprimé.</p>
                                        <p>Vous allez nous manquer et être redirigé(e) dans quelques instants vers la page d'inscription.</p>`});
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        redirect(`${configPath.basePath}/user/pages/registration.html`);
                    });
                };
            };
        }
    });
};

document.addEventListener("DOMContentLoaded", () => {
    deleteUser();
});