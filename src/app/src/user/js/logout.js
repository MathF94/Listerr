"use strict";

import { fetchLogout } from "./actions.js";
import { redirect, dialog } from "../../services/utils.js";

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
            redirect("http://localhost/listerr/src/app/src/user/pages/login.html", 2000);
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
                    redirect("http://localhost/listerr/src/app/src/home/pages/home.html", 2000);
                };
            };
        });
    });}
};

document.addEventListener("DOMContentLoaded", () => {
    logout();
})

export default logout;
