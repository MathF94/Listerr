"use strict";

import { fetchRead } from "../../actions/actions_user.js";
import { fetchReadAllLists } from "../../actions/actions_lists.js";
import {
    configPath,
    dialog,
    redirect,
    notAllowedRedirection,
} from "../../services/utils.js";

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
    listBtn.title ="Accéder à mes listes";
    updateBtn.title = "Modifier le profil";
    deleteBtn.title = "Supprimer le profil";

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

        fetchRead(id).then((response) => {
            if (
                response.status === "[Admin]user" &&
                localStorage.token &&
                localStorage.user
            ) {
                displayUser(response);

                // Affiche le bouton "Retour..." uniquement pour l'Admin
                if (JSON.parse(localStorage.user).role === "Admin") {
                    const returnBtn = document.createElement("button");
                    returnBtn.id = "returnBtn";
                    returnBtn.classList.add("btn");
                    returnBtn.classList.add("cancel");
                    returnBtn.innerText = "Retour";
                    returnBtn.type = "button";
                    returnBtn.title = "Revenir à la liste d'utilisateurs";

                    // En tant qu'Admin, modifie le texte du bouton
                    const listsUser = document.querySelector("#listsUser");
                    listsUser.innerText = "Listes de l'utilisateur";
                    listsUser.title = "Listes de l'utilisateur";
                    listsUser.after(returnBtn);

                    updateBtn.addEventListener("click", function (e) {
                        e.preventDefault();
                        dialog({
                            title: "Prévue pour la version 2.0",
                            content: "Merci de votre compréhension.",
                        });
                        redirect(
                            `${configPath.basePath}/user/pages/profil.html?id=${response.id.value}`
                        );
                    });

                    deleteBtn.addEventListener("click", function (e) {
                        e.preventDefault();
                        dialog({
                            title: "Prévue pour la version 2.0",
                            content: "Merci de votre compréhension.",
                        });
                        redirect(
                            `${configPath.basePath}/user/pages/profil.html?id=${response.id.value}`
                        );
                    });

                    // Permet de revenir aux listes d'utilisateurs
                    returnBtn.addEventListener("click", function (e) {
                        e.preventDefault();
                        redirect(
                            `${configPath.basePath}/admin/pages/profils.html`,
                            0
                        );
                    });
                }

                // Affiche les listes de l'utilisateur vu par l'Admin
                listBtn.addEventListener("click", function (e) {
                    e.preventDefault();

                    fetchReadAllLists(id).then((response) => {
                        const data = response.data;
                        if (response.status === "readAllListsByUser") {
                            const listWrapper = document.querySelector("#listsWrapper");

                            for (const index in data) {
                                const objectList = data[index];
                                const articleList = document.createElement("article");
                                articleList.id = `profilList-${objectList.id}`;
                                articleList.classList.add("list");

                                const sectionList = document.createElement("section");
                                const typeH3 = document.createElement("h3");
                                const titleH4 = document.createElement("h4");

                                for (const key in objectList) {
                                    const value = objectList[key];
                                    const item = document.createElement("p");

                                    if (key === "title") {
                                        titleH4.innerText = `${objectList.title}`;

                                    } else if (key === "type") {
                                        typeH3.innerText = `${objectList.type}`;
                                    }

                                    if (key === "user" && typeof value === "object") {
                                        const small = document.createElement("small");
                                        small.innerText = `Par ${objectList[key].login}.`;
                                        sectionList.appendChild(small);
                                    } else {
                                        if (key === "updatedAt") {
                                            const small = document.createElement("small");
                                            small.innerText = `Dernière modification le ${objectList[key]}`;
                                            sectionList.appendChild(small);
                                        }
                                    }

                                    // Exclut certains éléments de la liste
                                    if (["status", "id", "userId", "user", "type", "title", "cards", "createdAt", "updatedAt"].includes(`${key}`)) {
                                        continue;
                                    }
                                    item.innerText = `${objectList[key]}`;
                                    listWrapper.appendChild(articleList);
                                    articleList.appendChild(typeH3);
                                    articleList.appendChild(sectionList);
                                    sectionList.appendChild(titleH4);
                                    sectionList.appendChild(item);
                                }

                                // Redirige vers la page de détails de la liste en cliquant sur la liste.
                                sectionList.addEventListener("click",  function () {
                                        if (objectList.type === "TodoList" && objectList.user.id !== JSON.parse(localStorage.getItem("user")).id) {
                                            return false;
                                        }
                                        redirect(`${configPath.basePath}/list/pages/list.html?id=${objectList.id}`,
                                            0
                                        )
                                    }
                                )
                            }
                        }
                    })
                })
            }
        })
    }

    // Affichage du profil utilisateur courant
    if (urlParams.size === 0) {
        fetchRead().then((response) => {
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
                listBtn.addEventListener("click", function (e) {
                    redirect(`${configPath.basePath}/list/pages/lists.html`, 0);
                });
                // Redirige l'utilisateur vers la page de mise à jour de profil lorsqu'il clique sur le bouton "Mettre à jour".
                updateBtn.addEventListener("click", function (e) {
                    redirect(
                        `${configPath.basePath}/user/pages/update.html`,
                        0
                    );
                });
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    read();
});
