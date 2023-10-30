"use strict";

import { fetchRegister } from "../../actions/actions_user.js";
import { configPath } from "../../services/config.js";
import { CSRFToken } from "../../services/CSRFToken.js";
import { redirect, dialog } from "../../services/utils.js";

function registration() {
    registerForm.addEventListener("submit", function(e){
        e.preventDefault();

        fetchRegister(registerForm)
        .then(response => {
            localStorage.removeItem("csrfToken");

            if (response.status === "success") {
                const name = e.target.children.name.value;
                const firstname = e.target.children.firstname.value;
                const login = e.target.children.login.value;
                const email = e.target.children.email.value;
                dialog({title: `<p>Bienvenue !</p>`,
                        content: `<p>Bonjour ${firstname} ${name}.</p>
                            <p>Votre compte lié à l'adresse ${email} est maintenant créé sous le login ${login}.</p>
                            <p>Vous allez être redirigé dans quelques secondes vers la page de connexion...</p>
                `});
                redirect(`${configPath.basePath}/user/pages/login.html`, 2000)
            }

            if (response.status === "fail") {
                const errors = response.errors;
                dialog({title: "Erreurs", content: errors, hasTimeOut: true});
                redirect(`${configPath.basePath}/user/pages/registration.html`, 2000)
            };
        });
    });
};

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.querySelector("#registerForm");
    CSRFToken(registerForm.id);
    registration();
});

