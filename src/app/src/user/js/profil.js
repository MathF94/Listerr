"use strict";

import { fetchRead } from "../../actions/actions_user.js";
import { fetchReadAllLists } from "../../actions/actions_lists.js"
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
                listBtn.addEventListener("click", function(e){
                    e.preventDefault();
                    fetchReadAllLists(id)
                    .then(response => {
                        const data = response.data;
                        if (response.status === "readAllListsByUser"){
                            const listWrapper = document.querySelector('#listsWrapper');

                            for (const index in data) {
                                console.log(data);
                                const objectList = data[index]
                                const profilList = document.createElement("div");
                                profilList.id = `profilList-${objectList.id}`;
                                profilList.classList.add("profilList");

                                const contentList = document.createElement("div");
                                contentList.id = `contentList-${objectList.id}`;
                                contentList.classList.add("contentList");

                                const titleH3 = document.createElement("h3");
                                const list = document.createElement("ul");

                                // const deleteBtnLists = document.createElement("button");
                                // deleteBtnLists.id = `deleteProfilList-${objectList.id}`;
                                // deleteBtnLists.name = "deleteProfilList";
                                // deleteBtnLists.type = "submit";
                                // deleteBtnLists.value = `${objectList.id}`;
                                // deleteBtnLists.textContent = "Supprimer";
                                // deleteBtnLists.classList.add("deleteProfilList");

                                for (const key in objectList) {
                                    const value = objectList[key];
                                    const item = document.createElement("li");

                                    if (key === "type") {
                                        titleH3.innerText = `${objectList.type} - ${objectList.title}`;
                                    }
                                    if (["status", "id", "userId", "type", "title", "cards"].includes(`${key}`)) {
                                        continue;
                                    }
                                    if (key === "user" && typeof(value) === "object") {
                                        item.innerText = `Par ${objectList[key].login}.`;
                                    }
                                    else {
                                        if (key === "createdAt") {
                                            item.innerText = `Créée le ${objectList[key]}`;
                                        } else if (key === "updatedAt")  {
                                            item.innerText = `Modifiée le ${objectList[key]}`;
                                        } else {
                                            item.innerText = `${objectList[key]}`;
                                        }
                                    }

                                    contentList.appendChild(titleH3);
                                    list.appendChild(item);
                                    contentList.appendChild(list);
                                    profilList.appendChild(contentList);
                                    // profilList.appendChild(deleteBtnLists);
                                    listWrapper.append(profilList);
                                }

                                // Gestion de la suppression de liste
                                // deleteBtnLists.addEventListener("click", function(e){
                                //     e.preventDefault();
                                //     const btnListId = parseInt(e.target.value);

                                //     if (btnListId !== objectList.id) {
                                //         console.warn("pas touche");
                                //         return;
                                //     } else if (confirm('Voulez-vous vraiment vous supprimer la liste ?') === true) {
                                //         fetchDeleteList(objectList.id)
                                //         .then(() => {
                                //             dialog({title: "Suppression de la liste",
                                //             content: `<p>Votre liste a bien été supprimée.</p>`
                                //             });
                                //             redirect(`${configPath.basePath}/list/pages/lists.html`);
                                //         });
                                //     }
                                // })

                                // Redirige vers la page de détails de la liste en cliquant sur la liste.
                                contentList.addEventListener("click", function(){
                                    console.log({type: objectList.type, userId: objectList.user.id, localStorage: JSON.parse(localStorage.getItem("user")).id});
                                    if (objectList.type === "TodoList" && objectList.user.id !== JSON.parse(localStorage.getItem("user")).id) {
                                        return false;
                                    }
                                    redirect(`${configPath.basePath}/list/pages/list.html?id=${objectList.id}`, 0);
                                })
                            }
                        }
                    })

                })
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
