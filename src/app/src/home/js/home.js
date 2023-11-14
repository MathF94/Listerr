"use strict";

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
    if (
        token === undefined ||
        token === null ||
        user === null ||
        user === undefined
    ) {
        listBtn.addEventListener("click", function (e) {
            dialog({
                title: "Vous n'êtes pas encore connecté ?",
                content:
                    "Vous allez être redirigé(e) vers la page de connexion",
                hasTimeOut: true,
            });
            redirect(`${configPath.basePath}/user/pages/login.html`);
        });
        return;
    }

    if (user !== undefined && user !== null) {
        // Si l'utilisateur est connecté, ajoute un gestionnaire de clic pour rediriger vers la page de création de liste
        listBtn.addEventListener("click", function (e) {
            redirect(`${configPath.basePath}/list/pages/lists.html`, 0);
        });
    }

    // Récupère les listes depuis l'API et les affiche
    fetchAllListsByUsers().then((response) => {
        const data = response.data;
        if (response.status === "readAllListsAllUsers") {
            const homeDisplayLists =
                document.querySelector("#homeDisplayLists");

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
                const object = data[index];
                const articleList = document.createElement("article");
                articleList.id = `homeList-${object.id}`;
                articleList.classList.add("list");

                const sectionList = document.createElement("section");
                const typeH3 = document.createElement("h3");
                const titleH4 = document.createElement("h4");

                for (const key in object) {
                    const value = object[key];
                    const text = document.createElement("p");

                    if (key === "title") {
                        titleH4.innerText = `${object.title}`;
                        sectionList.appendChild(titleH4);
                    } else if (key === "type") {
                        typeH3.innerText = `${object.type}`;
                    }

                    if (key === "user" && typeof value === "object") {
                        const small = document.createElement("small");
                        small.innerText = `Par ${object[key].login}`;
                        sectionList.appendChild(small);
                    } else {
                        if (key === "updatedAt") {
                            const small = document.createElement("small");
                            small.innerText = `Dernière modification le ${object[key]}`;
                            sectionList.appendChild(small);
                        }
                    }

                    if (["status", "id", "userId", "user", "type", "title", "cards", "createdAt", "updatedAt"].includes(`${key}`)) {
                        continue;
                    }
                    text.innerText = `${object[key]}`;
                    titleLists.after(allListWrapper);
                    allListWrapper.appendChild(articleList);
                    articleList.appendChild(typeH3);
                    articleList.appendChild(sectionList);
                    sectionList.appendChild(text);
                }

                articleList.addEventListener("click", function () {
                    if (
                        object.type === "TodoList" &&
                        object.user.id !==
                            JSON.parse(localStorage.getItem("user")).id
                    ) {
                        return false;
                    }
                    redirect(
                        `${configPath.basePath}/list/pages/list.html?id=${object.id}`,
                        0
                    );
                });
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    readAllLists();
});
