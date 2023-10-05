"use strict";

import { fetchRegister } from "./actions.js";
import { redirect, dialog } from "../../services/utils.js";

function registration() {
    const form = document.querySelector("form");
    form.addEventListener("submit", function(e){
        e.preventDefault();

        fetchRegister(form)
        .then(response => {
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
                redirect("http://localhost/listerr/src/app/src/user/pages/login.html", 5000)
            }

            if (response.status === "fail") {
                const errors = response.errors;
                dialog({title: "Erreurs", content: errors, hasTimeOut: true});
                redirect("http://localhost/listerr/src/app/src/user/pages/registration.html", 3000)
            };
        });
    });
};

document.addEventListener("DOMContentLoaded", () => {
    registration();
});

