"use strict";

import { fetchRead, fetchUpdate } from "../../actions/actions_user.js";
import { CSRFToken } from "../../services/CSRFToken.js";
import { configPath, redirect, dialog, notAllowedRedirection } from "../../services/utils.js";

notAllowedRedirection();

/**
 * Gère le processus de mise à jour du profil de l'utilisateur, y compris la récupération des données actuelles de l'utilisateur,
 * la soumission du formulaire de mise à jour, la validation des données et la redirection de l'utilisateur en cas de succès ou d'échec.
 */
function updateUser() {
    // Récupère les données actuelles de l'utilisateur.
    fetchRead()
    .then(response => {
        const dataUser = response;
        for (const index in dataUser) {
            const column = dataUser[index];
            const input = document.querySelector(`input#${index}`)
            if (input) {
                input.value = column.value;
            };
        };
    });

    // Ajoute un gestionnaire d'événements pour soumettre le formulaire de mise à jour.
    updateForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const userLogin = e.target.login.value;

        if (e.submitter.value === "updateCancelBtn") {
            redirect(`${configPath.basePath}/user/pages/profil.html`, 0);
        } else {
            // Appelle la fonction fetchUpdate pour envoyer les données du formulaire de mise à jour au serveur.
            fetchUpdate(updateForm)
            .then(response => {
                localStorage.removeItem("csrfToken");
                const user = JSON.parse(localStorage.getItem("user"));

                if (response.status === "updateUser") {
                    if (userLogin !== user.login) {
                        // En cas de modification du login, déconnecte l'utilisateur et le redirige vers la page de connexion.
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");

                        dialog({title: `A tout de suite ${e.target.login.value} !`,
                                content: `<p>Votre login a bien été modifié.</p>
                                        <p>Vous allez être redirigé(e) vers la page de connexion, afin de vous reconnecter avec votre nouveau login.</p>`
                                    })
                        redirect(`${configPath.basePath}/user/pages/login.html`);
                    } else {
                        // Affiche un message de succès et redirige l'utilisateur vers la page de profil.
                        dialog({title: "Modification du profil", content: "Votre profil a bien été mis à jour."});
                        redirect(`${configPath.basePath}/user/pages/profil.html`);
                    }
                };
                if (response.status === "errors") {
                    // En cas d'échec, affiche les erreurs rencontrées et redirige l'utilisateur vers la page de profil.
                    dialog({title: "Erreurs", content: response.errors, hasTimeOut: true});
                    redirect(`${configPath.basePath}/user/pages/profil.html`);
                };
            });
        }
    });
};

document.addEventListener("DOMContentLoaded", () => {
    const updateForm = document.querySelector("#updateForm");
    CSRFToken(updateForm.attributes.id.value);
    updateUser();
})
