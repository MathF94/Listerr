"use strict"

import { fetchAllListsByUsers } from "../../actions/actions_home.js";
import { configPath, redirect, dialog } from "../../services/utils.js";

/**
 * Affiche les listes depuis une API sur la page d'accueil.
 */
function readAllLists() {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const listBtn = document.querySelector("#newList");

    // Vérifie si l'utilisateur est connecté
    if (token === undefined || token === null || user === null || user === undefined) {
        listBtn.addEventListener("click", function(e) {
            dialog({title:"Vous n'êtes pas encore connecté ?", content: "Vous allez être redirigé(e) vers la page de connexion", hasTimeOut: true})
            redirect(`${configPath.basePath}/user/pages/login.html`);
        });
        return;
    }

    if (user !== undefined && user !== null) {
        // Si l'utilisateur est connecté, ajoute un gestionnaire de clic pour rediriger vers la page de création de liste
        listBtn.addEventListener("click", function(e){
            redirect(`${configPath.basePath}/list/pages/lists.html`, 0);
        });
    }

    // Récupère les listes depuis l'API et les affiche
    fetchAllListsByUsers()
    .then(response => {
        const data = response.data;
        if (response.status === "readAllListsAllUsers"){
            const homeDisplayLists = document.querySelector("#homeDisplayLists");

            const allListsSection = document.createElement("section");
            allListsSection.id = "allListsSection";

            const titleLists = document.createElement("h2");
            titleLists.innerText = "Voici toutes les listes de tous les utilisateurs";

            const allListWrapper = document.createElement("div");
            allListWrapper.id = "allListsWrapper";

            homeDisplayLists.after(allListsSection);
            allListsSection.appendChild(titleLists);
            allListsSection.appendChild(allListWrapper);

            for (const index in data) {
                const object = data[index]
                const content = document.createElement("div");
                content.id = `homeList-${object.id}`;
                content.classList.add("homeList");
                const list = document.createElement("ul");
                const titleH3 = document.createElement("h3");

                for (const key in object) {
                    const value = object[key];

                    const item = document.createElement("li");

                    if (key === "type") {
                        titleH3.innerText = `${object.type} - ${object.title}`;
                    }
                    if (["status", "id", "userId", "type", "title", "cards"].includes(`${key}`)) {
                        continue;
                    }

                    if (key === "user" && typeof(value) === "object") {
                        item.innerText = `Par ${object[key].login}`;
                    } else {
                        if (key === "createdAt") {
                            item.innerText = `Créée le ${object[key]}`;
                        } else if (key === "updatedAt")  {
                            item.innerText = `Modifiée le ${object[key]}`;
                        } else {
                            item.innerText = `${object[key]}`;
                        }
                    }
                    titleLists.after(allListWrapper);
                    allListWrapper.appendChild(content);
                    content.appendChild(titleH3);
                    content.appendChild(list);
                    list.appendChild(item);
                }

                content.addEventListener("click", function(){
                    if (object.type === "TodoList" && object.user.id !== JSON.parse(localStorage.getItem("user")).id) {
                        return false;
                    }
                    redirect(`${configPath.basePath}/list/pages/list.html?id=${object.id}`, 0);
                })
            }
        }
    })
}

document.addEventListener("DOMContentLoaded", () => {
    readAllLists();
});