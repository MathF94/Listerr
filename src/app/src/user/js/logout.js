"use strict";

import { fetchLogout } from "./actions.js";
import { redirect, dialog } from "../../services/utils.js";

function logout() {
    const anchorLogout = document.querySelector("#nav_logout");
    localStorage.getItem("token");

    fetchLogout()
    .then(response => {
        if (response.status === "disconnect") {
            dialog({title: `A bientôt ${response.login} !`,
                    content: `<p>Votre session n'est pas ou plus active.</p>
                    <p>Vous allez être redirigé(e) dans quelques instants vers la page de connexion...</p>`
                });
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            redirect("#/login.html", 5000);
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
                    redirect("#/login.html", 5000);
                };
            };
        });
    });
};

document.addEventListener("DOMContentLoaded", () => {
    logout();
})

export default logout;
