"use strict";

import { displayFormList } from "./form_list.js";

import {
    fetchCreateList,
    fetchReadAllLists,
    fetchDeleteList
} from "../../actions/actions_lists.js";

import { dropDownMenu } from "../../layout/dropdown.js";

import { CSRFToken } from "../../services/CSRFToken.js";

import {
    configPath,
    allowedIds,
    type,
    redirect,
    dialog,
    notAllowedRedirection,
    scroll,
    validate
} from "../../services/utils.js";

notAllowedRedirection();

/**
 * Fonction principale pour gérer la page des listes.
 */
function lists() {
    const linkLists = document.querySelector("#lists");
    const linkProfil = document.querySelector("#profil");
    linkLists.classList.add("active");
    linkProfil.classList.remove("active");

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
                        dialog({title: "Création de liste", content: "Jetez à oeil dedans :)"});

                        const dialogMsg = document.querySelector("dialog");
                        dialogMsg.classList.add("valid");
                        redirect(`${configPath.basePath}/list/pages/lists.html`, 3000);
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
        const listsSection = document.querySelector("#listsSection");
        const emptyMessage = document.createElement("p");

        if (response.status === "standBy") {
            emptyMessage.innerText = "Aucune liste n'a encore été créée :)"
            listsSection.firstElementChild.after(emptyMessage);
        }
        if (response.status === "readAllListsByUser") {
            emptyMessage.remove();
            const listWrapper = document.querySelector('#listsWrapper');

            for (const index in data) {
                const objectList = data[index]
                const articleList = document.createElement("article");
                articleList.id = `profilList-${objectList.id}`;
                articleList.classList.add("grid");
                articleList.classList.add("grid_lists");
                articleList.classList.add("list");
                articleList.classList.add("little");
                articleList.classList.add(type[objectList.type]);

                // Si suppression du type de liste, mettre une couleur grise aux listes
                if(!['WishList', 'TodoList'].includes(objectList.type)) {
                    articleList.classList.add(type.Common)
                }

                const sectionList = document.createElement("section");
                sectionList.classList.add("pointer");
                sectionList.classList.add("grid_section");
                sectionList.id = `sectionList-${objectList.id}`;

                const typeH3 = document.createElement("h3");
                typeH3.id = `typeList-${objectList.id}`;
                typeH3.classList.add("grid_typeH3");

                const titleH4 = document.createElement("h4");
                titleH4.classList.add("grid_titleH4_lists");

                const actionBtnLists = document.createElement("div");
                actionBtnLists.id = `actionBtnLists-${objectList.id}`;
                actionBtnLists.classList.add("grid_action_btn_lists");

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

                    if (key === "title") {
                        titleH4.innerText = `${objectList.description}`;
                    } else if (key === "type") {
                        typeH3.innerText = `${objectList.type} - ${objectList.title} `;
                    }

                    // Exclut certains éléments de la liste (id, userId, type, title, cards, createdAd)
                    if (allowedIds.includes(`${key}`)) {
                        continue;
                    }

                    listWrapper.appendChild(articleList);
                    articleList.appendChild(typeH3);
                    articleList.appendChild(sectionList);
                    sectionList.appendChild(titleH4);
                    dropDownMenu(articleList, objectList.id, objectList.updatedAt, objectList.user.login);
                    // articleList.appendChild(actionBtnLists);
                    // actionBtnLists.appendChild(deleteBtnLists);
                }

                // Redirige vers la page de détails de la liste en cliquant sur la liste.
                sectionList.addEventListener("click", function(){
                    if (objectList.type === "TodoList" && objectList.user.id !== JSON.parse(localStorage.getItem("user")).id) {
                        return false;
                    } else {
                        redirect(`${configPath.basePath}/list/pages/list.html?id=${objectList.id}`, 0);
                    }
                })

                // Gestion de la suppression de liste
                deleteBtnLists.addEventListener("click", function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    const btnListId = parseInt(e.target.value);

                    if (btnListId !== objectList.id) {
                        console.warn("pas touche");
                        return;
                    } else if (confirm('Voulez-vous vraiment vous supprimer la liste ?') === true) {
                        scroll();
                        fetchDeleteList(objectList.id)
                        .then(() => {
                            dialog({title: "Suppression de la liste", content: `Votre liste a bien été supprimée.`});
                            const dialogMsg = document.querySelector("dialog");
                            dialogMsg.classList.add("valid");
                            redirect(`${configPath.basePath}/list/pages/lists.html`);
                        });
                    }
                })

            }
        }
    })
}

document.addEventListener("DOMContentLoaded", () => {
    lists();
});
