"use strict";

import { fetchAllListsByUsers } from "../../actions/actions_home.js";
import {
    configPath,
    allowedIds,
    redirect,
    dialog,
    toolTip
} from "../../services/utils.js";

/**
 * Affiche les listes depuis une API sur la page d'accueil.
 */
function readAllLists() {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const listBtn = document.querySelector("#newList");
    listBtn.title = "Créer une nouvelle liste";

    // Vérifie si l'utilisateur est connecté
    if (token === undefined || token === null || user === null || user === undefined) {
        const sectionText = document.querySelector("#createList");
        const textUnsubscribed_1 = document.createElement("p");
        const textUnsubscribed_2 = document.createElement("p");
        textUnsubscribed_1.innerHTML = `Seules les personnes inscrites peuvent utiliser cette web-app.`;
        textUnsubscribed_2.innerHTML = `Pour en profiter, créez-vous un compte.`;
        sectionText.appendChild(textUnsubscribed_1);
        sectionText.appendChild(textUnsubscribed_2);

        listBtn.addEventListener("click", function (e) {
            dialog({
                title: "Vous n'êtes pas encore connecté ?",
                content: "Vous allez être redirigé(e) vers la page de connexion"
            });
            listBtn.disabled = true;
            listBtn.classList.remove("way");
            listBtn.classList.add("disable");

            const dialogMsg = document.querySelector("dialog");
            dialogMsg.classList.add("home");

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
                const object = data[index];
                const articleList = document.createElement("article");
                articleList.id = `homeList-${object.id}`;
                articleList.classList.add("list");
                articleList.classList.add("grid");

                if(JSON.parse(localStorage.user).id !== object.userId) {
                    articleList.classList.add("third_party_wish");
                }
                else {
                    articleList.classList.add("wish");
                }

                const sectionList = document.createElement("section");
                sectionList.classList.add("grid_section");
                const typeH3 = document.createElement("h3");
                typeH3.classList.add("grid_typeH3");
                const titleH4 = document.createElement("h4");

                // N'affiche que les WishList
                if(object.type === "WishList"){

                    for (const key in object) {
                        const text = document.createElement("p");

                        if (key === "title") {
                            titleH4.innerText = `${object.title}`;
                            sectionList.appendChild(titleH4);
                        } else if (key === "type") {
                            typeH3.innerText = `${object.type}`;
                        }

                        if (key === "updatedAt") {
                            toolTip(articleList, object.id, object.updatedAt, object.user.login)
                        }

                        if (allowedIds.includes(`${key}`)) {
                            continue;
                        }

                        text.innerText = `${object[key]}`;
                        titleLists.after(allListWrapper);
                        allListWrapper.appendChild(articleList);
                        articleList.appendChild(typeH3);
                        articleList.appendChild(sectionList);
                        sectionList.appendChild(text);
                    }
                }

                articleList.addEventListener("click", function () {
                    if (object.type === "TodoList" && object.user.id !== JSON.parse(localStorage.getItem("user")).id) {
                        return false;
                    }
                    redirect(`${configPath.basePath}/list/pages/list.html?id=${object.id}`, 0)
                })
            }
        }
    })
}

document.addEventListener("DOMContentLoaded", () => {
    readAllLists();
});
