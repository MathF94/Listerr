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

import { fetchRead, fetchUpdate } from "../../actions/actions_user.js";

import { CSRFToken } from "../../services/CSRFToken.js";

import {
    configPath,
    redirect,
    dialog,
    notAllowedRedirection,
    validate
} from "../../services/utils.js";

notAllowedRedirection();

/**
 * Gère le processus de mise à jour du profil de l'utilisateur, y compris la récupération des données actuelles de l'utilisateur,
 * la soumission du formulaire de mise à jour, la validation des données et la redirection de l'utilisateur en cas de succès ou d'échec.
 */
function updateUser() {
    // Récupère les données actuelles de l'utilisateur.
    fetchRead()
    .then((response) => {
        const dataUser = response;
        for (const index in dataUser) {
            const column = dataUser[index];
            const input = document.querySelector(`input#${index}`);
            if (input) {
                input.value = column.value;
            }
        }
    });
    const cancelBtn = document.querySelector("#updateCancelBtn");
    cancelBtn.addEventListener("click", function (e) {
        redirect(`${configPath.basePath}/user/pages/profil.html`, 0);
    });

    updateForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const userLogin = e.target.login.value;

        // Validation de pattern du formulaire
        const inputLogin = document.querySelector("#login");
        const inputName = document.querySelector("#name");
        const inputFirstname = document.querySelector("#firstname");
        const inputEmail = document.querySelector("#email");
        inputLogin.addEventListener("invalid", function(e) {
            validate(e.target)
        });
        inputName.addEventListener("invalid", function(e) {
            validate(e.target)
        });
        inputFirstname.addEventListener("invalid", function(e) {
            validate(e.target)
        });
        inputEmail.addEventListener("invalid", function(e) {
            validate(e.target)
        });

        // Appelle la fonction fetchUpdate pour envoyer les données du formulaire de mise à jour au serveur.
        fetchUpdate(updateForm)
        .then((response) => {
            localStorage.removeItem("csrfToken");
            const user = JSON.parse(localStorage.getItem("user"));
            const updateProfil = document.querySelector("#updateProfil");
            if (response.status === "updateUser") {
                if (userLogin !== user.login) {
                    // En cas de modification du login, déconnecte l'utilisateur et le redirige vers la page de connexion.
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    dialog({
                        title: `A tout de suite ${e.target.login.value} !`,
                        content: `<p>Votre login a bien été modifié.</p>
                                    <p>Vous allez être redirigé(e) vers la page de connexion, afin de vous reconnecter avec votre nouveau login.</p>`,
                    });
                    const dialogMsg = document.querySelector("dialog");
                    dialogMsg.classList.add("valid");
                    updateProfil.classList.add("hidden");
                    redirect(`${configPath.basePath}/user/pages/login.html`);
                } else {
                    // Affiche un message de succès et redirige l'utilisateur vers la page de profil.
                    dialog({
                        title: "Modification du profil",
                        content: "Votre profil a bien été mis à jour.",
                    });
                    const dialogMsg = document.querySelector("dialog");
                    dialogMsg.classList.add("valid");
                    updateProfil.classList.add("hidden");
                    redirect(`${configPath.basePath}/user/pages/profil.html`);
                }
            }

            if (response.status === "errors") {
                // En cas d'échec, affiche les erreurs rencontrées et redirige l'utilisateur vers la page de profil.
                dialog({
                    title: "Erreurs",
                    content: response.errors,
                });
                const dialogMsg = document.querySelector("dialog");
                dialogMsg.classList.add("errors");
                updateForm.classList.add("hidden");
                redirect(`${configPath.basePath}/user/pages/profil.html`);
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const updateForm = document.querySelector("#updateForm");
    CSRFToken(updateForm.attributes.id.value);
    updateUser();
});
