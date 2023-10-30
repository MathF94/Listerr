"use strict";

import { fetchRead, fetchUpdate } from "../../actions/actions_user.js";
import { configPath } from "../../services/config.js";
import { CSRFToken } from "../../services/CSRFToken.js";
import { redirect, dialog } from "../../services/utils.js";

function updateUser() {
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

    updateForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const userLogin = e.target.login.value;

        fetchUpdate(updateForm)
        .then(response => {
            localStorage.removeItem("csrfToken");
            const user = JSON.parse(localStorage.getItem("user"));

            if (response.status === "success") {
                if (userLogin !== user.login) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    dialog({title: `A tout de suite ${e.target.login.value} !`,
                            content: `<p>Votre login a bien été modifié.</p>
                                    <p>Vous allez être redirigé(e) vers la page de connexion, afin de vous reconnecter avec votre nouveau login.</p>`
                                })
                    redirect(`${configPath.basePath}/user/pages/login.html`, 2000);
                } else {
                    dialog({content: "Votre profil a bien été mis à jour."});
                    redirect(`${configPath.basePath}/user/pages/profil.html`, 2000);
                }
            };
            if (response.status === "fail") {
                dialog({title: "Erreurs", content: response.errors, hasTimeOut: true});
                redirect(`${configPath.basePath}/user/pages/profil.html`, 2000);
            };
        });
    });
};

document.addEventListener("DOMContentLoaded", () => {
    const updateForm = document.querySelector("#updateForm");
    CSRFToken(updateForm.attributes.id.value);
    updateUser();
})
