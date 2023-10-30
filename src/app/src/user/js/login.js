"use strict";

import { fetchLogin } from "../../actions/actions_user.js";
import { configPath } from "../../services/config.js";
import { CSRFToken } from "../../services/CSRFToken.js";
import { redirect, dialog } from "../../services/utils.js";

function login() {
    loginForm.addEventListener("submit", function(e){
        e.preventDefault();

        fetchLogin(loginForm)
        .then(response => {
            localStorage.removeItem("csrfToken");

            if (response.status === "success") {
                localStorage.setItem("token", response.token);
                localStorage.setItem("user", JSON.stringify({
                    id: response.user_id,
                    login: response.user_login,
                    role: response.user_role,
                    is_admin: response.user_isAdmin
                }));

                const login = e.target.children.login.value;
                dialog({title: `<p>Bonjour ${login} !</p>`, content: `<p>Vous êtes bien connecté(e).</p>`});
                redirect(`${configPath.basePath}/home/pages/home.html`, 2000);
            };

            if (response.status === "fail_data") {
                dialog({title: "Erreurs de données", content: response.message, hasTimeOut: true});
                redirect(`${configPath.basePath}/user/pages/login.html`, 2000);
            };

            if (response.status === "fail") {
                dialog({title: "Erreurs", content: response.errors, hasTimeOut: true});
                redirect(`${configPath.basePath}/user/pages/login.html`, 2000);
            };
        });
    });
};

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#loginForm");
    CSRFToken(loginForm.id);
    login();
});


