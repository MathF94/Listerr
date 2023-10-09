"use strict";

import { fetchRegister } from "./actions.js";
import { redirect, dialog } from "../../services/utils.js";

console.log("registration");

function registration() {
    const content = document.querySelector("#content");
    console.log(content);
    const form = document.querySelector("form");
    console.log(form);

    form.addEventListener("submit", function(e){
        e.preventDefault();

        return fetchRegister(form)
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
                redirect("#/login.html", 5000)
            }

            if (response.status === "fail") {
                const errors = response.errors;
                dialog({title: "Erreurs", content: errors, hasTimeOut: true});
                // redirect("http://localhost/#/registration.html", 3000)
            };
        });

    });
};

document.addEventListener("DOMContentLoaded", () => {
    registration();
});
export default registration;
