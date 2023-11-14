"use strict";

import { fetchRegister } from "../../actions/actions_user.js";
import { CSRFToken } from "../../services/CSRFToken.js";
import { configPath, redirect, dialog } from "../../services/utils.js";

/**
 * Gère le processus d'inscription de l'utilisateur, y compris la soumission du formulaire d'inscription,
 * la validation des données et la redirection de l'utilisateur.
 */
function registration() {
    // Ajoute un gestionnaire d'événements pour soumettre le formulaire d'inscription.
    registerForm.addEventListener("submit", function(e){
        e.preventDefault();

        // Appelle la fonction fetchRegister pour envoyer les données du formulaire d'inscription au serveur.
        fetchRegister(registerForm)
        .then(response => {
            localStorage.removeItem("csrfToken");

            if (response.status === "createUser") {
                // En cas de succès, affiche un message de bienvenue et redirige l'utilisateur vers la page de connexion.
                const name = e.target.children.name.value;
                const firstname = e.target.children.firstname.value;
                const login = e.target.children.login.value;
                const email = e.target.children.email.value;
                dialog({title: `<p>Bienvenue !</p>`,
                        content: `<p>Bonjour ${firstname} ${name}.</p>
                            <p>Votre compte lié à l'adresse ${email} est maintenant créé sous le login ${login}.</p>
                            <p>Vous allez être redirigé(e) dans quelques secondes vers la page de connexion...</p>
                `});
                redirect(`${configPath.basePath}/user/pages/login.html`)
            }

            if (response.status === "errors") {
                // En cas d'échec, affiche les erreurs rencontrées et redirige l'utilisateur vers la page d'inscription.
                dialog({title: "Erreurs", content: response.errors});
                // redirect(`${configPath.basePath}/user/pages/registration.html`)
            };
        });
    });
};

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.querySelector("#registerForm");
    CSRFToken(registerForm.id);
    registration();
});

