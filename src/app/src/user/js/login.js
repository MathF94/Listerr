"use strict";

import { fetchLogin } from "../../actions/actions_user.js";
import { CSRFToken } from "../../services/CSRFToken.js";
import { configPath, redirect, dialog } from "../../services/utils.js";

/**
 * Gère le processus de connexion de l'utilisateur.
 */
function login() {
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

                // const login = e.target.children.login.value;
                dialog({title: `<p>Bonjour ${login} !</p>`, content: `<p>Vous êtes bien connecté(e).</p>`});
                redirect(`${configPath.basePath}/home/pages/home.html`);
            };

            if (response.status === "loginUser failed") {
                dialog({title: "Erreurs de données", content: response.message, hasTimeOut: true});
                redirect(`${configPath.basePath}/user/pages/login.html`);
            };

            if (response.status === "errors") {
                dialog({title: "Erreurs", content: response.errors, hasTimeOut: true});
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


