"use strict";

import { fetchLogout } from "../../actions/actions_user.js";
import { configPath, redirect, dialog } from "../../services/utils.js";

/**
 * Gère le processus de déconnexion de l'utilisateur.
 */
function logout() {
    const anchorLogout = document.querySelector("#logout");
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token !== null || user !== null) {
    fetchLogout()
    .then(response => {
        if (response.status === "disconnect") {
            dialog({title: `A bientôt ${response.login} !`,
                    content: `<p>Votre session n'est pas ou plus active.</p>
                    <p>Vous allez être redirigé(e) dans quelques instants vers la page de connexion...</p>`
                });
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            redirect(`${configPath.basePath}/user/pages/login.html`);
        }

        anchorLogout.addEventListener("click", function(e) {
            e.preventDefault();

            if (confirm("Voulez-vous vraiment vous déconnecter ?") === true) {
                if(response.status === "connected") {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    dialog({title: `A bientôt ${response.login} !`,
                            content: "Vous allez être redirigé(e) dans quelques instants vers la page de connexion..."
                        });
                    redirect(`${configPath.basePath}/home/pages/home.html`);
                };
            };
        });
    });
    }
};

document.addEventListener("DOMContentLoaded", () => {
    logout();
})

export { logout };
