"use strict";

import { fetchLogout } from "./actions.js";
import { redirect, dialog, uploadElement } from "../../services/utils.js";


function logout(anchorLogout) {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token !== undefined || token !== null || user !== undefined || user !== null) {
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
    }
}

function getNav() {
    uploadElement('#nav_logout')
    .then(form => {
        logout(form);
    })
}

window.addEventListener("load", getNav());
window.addEventListener("hashchange", getNav());

export default logout;
