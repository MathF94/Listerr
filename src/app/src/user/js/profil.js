"use strict";

import { fetchRead } from "../../actions/actions_user.js";
import { configPath, redirect, notAllowedRedirection } from "../../services/utils.js";

notAllowedRedirection();

/**
 * Gère l'affichage des informations de profil de l'utilisateur et les fonctionnalités associées.
 *      l'affichage des informations d'un profil utilisateur par l'admin
 */
function read() {
    // Appelle la fonction fetchRead pour obtenir les informations du profil de l'utilisateur.
    const urlParams = new URLSearchParams(document.location.search);
    const deleteBtn = document.querySelector("#delete");
    const updateBtn = document.querySelector("#update");
    const listBtn = document.querySelector("#listsUser");

    function displayUser(response) {
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
    }

    // Affichage d'un utilisateur vu par l'admin
    if (urlParams.has("id")) {
        // Obtient l'identifiant de la liste à partir des paramètres de l'URL.
        const id = urlParams.get("id");

        fetchRead(id)
        .then(response => {
            if (response.status === "[Admin]user" && localStorage.token && localStorage.user) {
                displayUser(response);
            };
        });
    }

    // Affichage du profil utilisateur
    if (urlParams.size === 0) {
        fetchRead()
        .then(response => {

            if (response.status === "disconnected") {
                // Masque les boutons de suppression et de mise à jour lorsque l'utilisateur est déconnecté.
                deleteBtn.classList.add("hide");
                updateBtn.classList.add("hide");
            }

            if (response.status === "connected" && localStorage.token && localStorage.user) {
                // Affiche les boutons de suppression et de mise à jour lorsque l'utilisateur est connecté.
                if (JSON.parse(localStorage.user).role === "Admin") {
                    deleteBtn.remove();
                }

                deleteBtn.classList.remove("hide");
                updateBtn.classList.remove("hide");

                displayUser(response);

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
    }
};

document.addEventListener("DOMContentLoaded", () => {
    read();
});
