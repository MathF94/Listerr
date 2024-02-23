"use strict";

import {
    fetchCreateList,
    fetchReadAllLists,
    fetchDeleteList
} from "../../actions/actions_lists.js";
import { CSRFToken } from "../../services/CSRFToken.js";
import {
    configPath,
    redirect,
    dialog,
    notAllowedRedirection,
    scroll,
    validate
} from "../../services/utils.js";
import { displayFormList } from "./form_list.js";

notAllowedRedirection();

/**
 * Fonction principale pour gérer la page des listes.
 */
function lists() {
    const createListBtn = document.querySelector("#listCreater");
    createListBtn.title = "Créer une nouvelle liste";

    // Affiche le formulaire de création de liste lorsqu'on clique sur le bouton "Créer une nouvelle liste".
    createListBtn.addEventListener("click", function(){
        if (createListBtn.value === "newList") {
            const divList = document.querySelector("#divList");

            // Appelle le formulaire pour la création de la liste
            displayFormList(divList)
            titleFormList.innerText = "Formulaire de création de la liste";
            createListBtn.disabled = true;
            createListBtn.classList.remove("way");
            createListBtn.classList.add("disable");

            const listForm = document.querySelector("#listFormSection");
            const formList = document.querySelector("#formList");

            // Masque le formulaire de création de liste lorsqu'on clique sur le bouton "Annuler".
            cancelForm.addEventListener("click", function(e){
                e.preventDefault();
                listForm.remove();
                createListBtn.disabled = false;
                createListBtn.classList.remove("disable");
                createListBtn.classList.add("way");
            })

            // Gère la soumission du formulaire de création de liste.
            CSRFToken(formList.id);
            formList.addEventListener("submit", function(e){
                e.preventDefault();

                // Validation de pattern du formulaire
                const inputTitle = document.querySelector("#titleList");
                const inputDescription = document.querySelector("#descriptionList");
                const selectType = document.querySelector("#typeList")
                inputTitle.addEventListener("invalid", function(e) {
                    validate(e.target)
                });
                inputDescription.addEventListener("invalid", function(e) {
                    validate(e.target)
                });
                selectType.addEventListener("invalid", function(e) {
                    validate(e.target)
                });

                // Remonte en haut de page après action
                scroll();
                fetchCreateList(formList)
                .then(response => {
                    localStorage.removeItem("csrfToken");

                    if (response.status === "createList") {
                        dialog({title: "Et une liste de créée, une !", content:"aux cartes maintenant !"});
                        const dialogMsg = document.querySelector("dialog");
                        dialogMsg.classList.add("valid");
                        redirect(`${configPath.basePath}/list/pages/lists.html`);
                    }
                    if (response.status === "errors") {
                        dialog({title: "Erreurs", content: response.errors});
                        const dialogMsg = document.querySelector("dialog");
                        dialogMsg.classList.add("errors");
                        redirect(`${configPath.basePath}/list/pages/lists.html`);
                    };
                })
            })
        }
    })

    // Récupère et affiche la liste des listes existantes.
    fetchReadAllLists()
    .then(response => {
        const data = response.data;
        if (response.status === "readAllListsByUser"){
            const listWrapper = document.querySelector('#listsWrapper');

            for (const index in data) {
                const objectList = data[index]
                console.log(objectList.type);

                const articleList = document.createElement("article");
                articleList.id = `profilList-${objectList.id}`;
                articleList.classList.add("list");

                if(objectList.type === "WishList"){
                    articleList.classList.add("wish");
                }
                if(objectList.type === "TodoList"){
                    articleList.classList.add("todo");
                }

                const sectionList = document.createElement("section");

                const typeH3 = document.createElement("h3");
                const titleH4 = document.createElement("h4");

                const deleteBtnLists = document.createElement("button");
                deleteBtnLists.id = `deleteProfilList-${objectList.id}`;
                deleteBtnLists.title = "Supprimer la liste";
                deleteBtnLists.name = "deleteProfilList";
                deleteBtnLists.title = "Supprimer la liste";
                deleteBtnLists.type = "submit";
                deleteBtnLists.value = `${objectList.id}`;
                deleteBtnLists.textContent = "";
                deleteBtnLists.classList.add("btn");
                deleteBtnLists.classList.add("delete");

                for (const key in objectList) {
                    const value = objectList[key];
                    const text = document.createElement("p");

                    if (key === "title") {
                        titleH4.innerText = `${objectList.title}`;
                    } else if (key === "type") {
                        typeH3.innerText = `${objectList.type}`;
                    }

                    if (key === "user" && typeof(value) === "object") {
                        const small = document.createElement("small");
                        small.innerText = `Par ${objectList[key].login}.`;
                        sectionList.appendChild(small);
                    }
                    else {
                        if (key === "updatedAt") {
                            const small = document.createElement("small");
                            small.innerText = `Dernière modification le ${objectList[key]}`;
                            sectionList.appendChild(small);
                        } else {
                        }
                    }

                    // Exclut certains éléments de la liste (id, userId, type, title, cards, createdAd)
                    if (["status", "id", "userId", "user", "type", "title", "cards", "createdAt", "updatedAt"].includes(`${key}`)) {
                        continue;
                    }
                    text.innerText = `${objectList[key]}`;
                    listWrapper.append(articleList);
                    articleList.appendChild(typeH3);
                    sectionList.appendChild(titleH4);
                    articleList.appendChild(sectionList);
                    sectionList.appendChild(text);
                    articleList.appendChild(deleteBtnLists);
                }

                // Gestion de la suppression de liste
                deleteBtnLists.addEventListener("click", function(e){
                    e.preventDefault();
                    const btnListId = parseInt(e.target.value);

                    if (btnListId !== objectList.id) {
                        console.warn("pas touche");
                        return;
                    } else if (confirm('Voulez-vous vraiment vous supprimer la liste ?') === true) {
                        scroll();
                        fetchDeleteList(objectList.id)
                        .then(() => {
                            dialog({title: "Suppression de la liste", content: `<p>Votre liste a bien été supprimée.</p>`});
                            const dialogMsg = document.querySelector("dialog");
                            dialogMsg.classList.add("valid");
                            redirect(`${configPath.basePath}/list/pages/lists.html`);
                        });
                    }
                })

                // Redirige vers la page de détails de la liste en cliquant sur la liste.
                sectionList.addEventListener("click", function(){
                    if (objectList.type === "TodoList" && objectList.user.id !== JSON.parse(localStorage.getItem("user")).id) {
                        return false;
                    }
                    redirect(`${configPath.basePath}/list/pages/list.html?id=${objectList.id}`, 0);
                })
            }
        }
    })
}

document.addEventListener("DOMContentLoaded", () => {
    lists();
});
