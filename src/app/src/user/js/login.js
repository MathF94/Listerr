"use strict";

import { fetchLogin } from "../../actions/actions_user.js";
import { CSRFToken } from "../../services/CSRFToken.js";
import { configPath, redirect, dialog, validate } from "../../services/utils.js";

/**
 * Gère le processus de connexion de l'utilisateur.
 */
function login() {
    const loginBtn = document.querySelector("#loginBtn");
    loginBtn.title = "Validation pour la connexion";

    const noRegisterYet = document.querySelector("#noRegisterYet");
    noRegisterYet.title = "Pas encore de compte ?";

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
                    role: response.user_role,
                    is_admin: response.user_isAdmin
                }));

                const login = JSON.parse(localStorage.user).login;
                dialog({title: `<p>Bonjour ${login} !</p>`, content: `<p>Vous êtes bien connecté(e).</p>`});
                const dialogMsg = document.querySelector("dialog");
                dialogMsg.classList.add("login");
                dialogMsg.classList.add("valid");
                loginForm.classList.add("hidden");
                redirect(`${configPath.basePath}/home/pages/home.html`);
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


