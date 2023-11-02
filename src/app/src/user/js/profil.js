"use strict";

import { fetchRead } from "../../actions/actions_user.js";
import { configPath, redirect } from "../../services/utils.js";

/**
 * Gère l'affichage des informations de profil de l'utilisateur et les fonctionnalités associées.
 */
function read() {
    // Appelle la fonction fetchRead pour obtenir les informations du profil de l'utilisateur.
    fetchRead()
    .then(response => {
        const deleteBtn = document.querySelector("#delete");
        const updateBtn = document.querySelector("#update");
        const listBtn = document.querySelector("#listsUser");

        if (response.status === "disconnected") {
            // Masque les boutons de suppression et de mise à jour lorsque l'utilisateur est déconnecté.
            deleteBtn.classList.add("hide");
            updateBtn.classList.add("hide");
        }

        if (response.status === "connected" && localStorage.token && localStorage.user) {
            // Affiche les boutons de suppression et de mise à jour lorsque l'utilisateur est connecté.
            deleteBtn.classList.remove("hide");
            updateBtn.classList.remove("hide");
            const profilWrapper = document.querySelector("#profilWrapper");
            const list = document.createElement("ul");

            for (const index in response) {
                const item = document.createElement("li");
                const column = response[index];

                if (["status", "id"].includes(index)) {
                    continue;
                }

                item.innerText = `${column.label} : ${column.value}`;
                list.appendChild(item);
            }
            profilWrapper.prepend(list);

            // Redirige l'utilisateur vers la page de listes lorsqu'il clique sur le bouton "Listes d'utilisateurs".
            listBtn.addEventListener("click", function(e){
                redirect(`${configPath.basePath}/list/pages/lists.html`, 0);
            });
            // Redirige l'utilisateur vers la page de mise à jour de profil lorsqu'il clique sur le bouton "Mettre à jour".
            updateBtn.addEventListener("click", function(e){
                redirect(`${configPath.basePath}/user/pages/update.html`, 0);
            });
        };
    });
};

document.addEventListener("DOMContentLoaded", () => {
    read();
});
