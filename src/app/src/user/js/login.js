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

import { fetchLogin } from "../../actions/actions_user.js";

import { CSRFToken } from "../../services/CSRFToken.js";

import {
    configPath,
    redirect,
    dialog,
    validate,
    reveal
} from "../../services/utils.js";

/**
 * Gère le processus de connexion de l'utilisateur.
 */
function login() {
    // Affiche ou cache le mot de passe
    reveal();
     // Obtient l'identifiant de la liste à partir des paramètres de l'URL.
    const urlParams = new URLSearchParams(document.location.search);
    const id = urlParams.get("id");
    const redirection = urlParams.get("redirection");

    const loginBtn = document.querySelector("#loginBtn");
    loginBtn.title = "Valider la connexion";

    const noRegisterYet = document.querySelector("#noRegisterYet");
    noRegisterYet.title = "Redirection pour création de compte";
    noRegisterYet.setAttribute('href', `${configPath.basePath}/user/pages/registration.html`);
    noRegisterYet.addEventListener("click", e => {
        e.preventDefault();
        localStorage.nav_active ="register";
        redirect(`${configPath.basePath}/user/pages/registration.html`);
    })

    // Validation de pattern du formulaire
    const inputLogin = document.querySelector("#login");
    const inputPassword = document.querySelector("#password");
    inputLogin.addEventListener("invalid", function(e) {
        validate(e.target)
    });
    inputPassword.addEventListener("invalid", function(e) {
        validate(e.target)
    });

    loginForm.addEventListener("submit", function(e){
        e.preventDefault();
        fetchLogin(loginForm)
        .then(response => {
            localStorage.removeItem("csrfToken");
            if (response.status === "loginUser") {
                // Ces deux informations permettront de vérifier si la session utilisateur est active
                //                                   de vérifier si la déconnexion est réalisable (Cf. logout.js).
                localStorage.setItem("token", response.token);
                localStorage.setItem("user", JSON.stringify({
                    id: response.user_id,
                    login: response.user_login,
                    email: response.user_email,
                    role: response.user_role,
                    is_admin: response.user_isAdmin
                }));

                const login = JSON.parse(localStorage.user).login;

                dialog({
                    title: `Bonjour ${login} !`,
                    content: `Vous êtes bien connecté(e).`
                });

                const dialogMsg = document.querySelector("dialog");
                dialogMsg.classList.add("valid");

                if (redirection === "") {
                    localStorage.nav_active ="home";
                    redirect(`${configPath.basePath}/list/pages/list.html?id=${id}`)
                } else {
                    localStorage.nav_active ="home";
                    redirect(`${configPath.basePath}/home/pages/home.html`);
                }
            };

            if (response.status === "loginUser failed") {
                dialog({title: "Erreurs de données", content: response.message});
                const dialogMsg = document.querySelector("dialog");
                dialogMsg.classList.add("errors");
                loginForm.classList.add("hidden");
                redirect(`${configPath.basePath}/user/pages/login.html`);
            };

            if (response.status === "errors") {
                dialog({title: "Erreurs", content: response.errors});
                const dialogMsg = document.querySelector("dialog");
                dialogMsg.classList.add("errors_fields");
                loginForm.classList.add("hidden");
                redirect(`${configPath.basePath}/user/pages/login.html`);
            };
        });
    });
};

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#loginForm");
    CSRFToken(loginForm.id);
    login();
});


