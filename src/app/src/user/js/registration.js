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

import { fetchRegister } from "../../actions/actions_user.js";

import { CSRFToken } from "../../services/CSRFToken.js";

import {
    configPath,
    redirect,
    dialog,
    reveal
} from "../../services/utils.js";

/**
 * Gère le processus d'inscription de l'utilisateur, y compris la soumission du formulaire d'inscription,
 * la validation des données et la redirection de l'utilisateur.
 */
function registration() {
    localStorage.nav_active ="register";
    // Affiche ou cache le mot de passe
    reveal();
    const registerBtn = document.querySelector("#registerBtn");
    registerBtn.title = "Valider l'inscription";

    const alreadyRegistered = document.querySelector("#alreadyRegistered");
    alreadyRegistered.title = "Redirection vers la page de connexion";
    alreadyRegistered.setAttribute('href', `${configPath.basePath}/user/pages/login.html`);
    alreadyRegistered.addEventListener("click", e => {
        e.preventDefault();
        localStorage.nav_active ="connexion";
        redirect(`${configPath.basePath}/user/pages/login.html`);
    })

    // Ajoute un gestionnaire d'événements pour soumettre le formulaire d'inscription.
    registerForm.addEventListener("submit", function(e){
        e.preventDefault();

        // Validation de pattern du formulaire
        const inputLogin = document.querySelector("#login");
        const inputName = document.querySelector("#name");
        const inputFirstname = document.querySelector("#firstname");
        const inputPassword = document.querySelector("#password");
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
        inputPassword.addEventListener("invalid", function(e) {
            validate(e.target)
        });
        inputEmail.addEventListener("invalid", function(e) {
            validate(e.target)
        });

        // Appelle la fonction fetchRegister pour envoyer les données du formulaire d'inscription au serveur.
        fetchRegister(registerForm)
        .then(response => {
            localStorage.removeItem("csrfToken");
            if (response.status === "createUser") {
                // En cas de succès, affiche un message de bienvenue et redirige l'utilisateur vers la page de connexion.
                const name = e.target.name.value;
                const firstname = e.target.firstname.value;
                const login = e.target.login.value;
                const email = e.target.email.value;

                if (localStorage.user && JSON.parse(localStorage.user).role === 'Admin') {
                    dialog({
                        title: `<p>Inscription d'un utilisateur</p>`,
                        content: `<p>Le compte de ${firstname} ${name}, lié à l'adresse ${email}, sous le login ${login} a bien été créé.</p>
                                <p>Vous allez être redirigé(e) dans quelques secondes vers la page de connexion...</p>`
                    });

                    const dialogMsg = document.querySelector("dialog");
                    dialogMsg.classList.add("valid");
                    dialogMsg.classList.add("register");

                    redirect(`${configPath.basePath}/admin/pages/profils.html`);
                } else {
                    dialog({
                        title: `<p>Bienvenue ${login} !</p>`,
                        content: `<p>Vous êtes bien inscrit(e).</p>`
                    });
                    const dialogMsg = document.querySelector("dialog");
                    dialogMsg.classList.add("valid");
                    redirect(`${configPath.basePath}/user/pages/login.html`, 3000)
                }
            }

            if (response.status === "errors") {
                // En cas d'échec, affiche les erreurs rencontrées et redirige l'utilisateur vers la page d'inscription.
                dialog({
                    title: "Erreurs",
                    content: response.errors
                });
                const dialogMsg = document.querySelector("dialog");
                dialogMsg.classList.add("errors");
                registerForm.classList.add("hidden");
                redirect(`${configPath.basePath}/user/pages/registration.html`)
            };
        });
    });
};

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.querySelector("#registerForm");
    CSRFToken(registerForm.id);
    registration();
});

