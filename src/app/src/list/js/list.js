"use strict";

import { displayFormList } from "./form_list.js";

import {
    fetchReadOneListById,
    fetchDeleteList,
    fetchUpdateList
} from "../../actions/actions_lists.js";

import { card } from "../../card/js/card.js";

import { dropDownMenu } from "../../layout/dropdown.js";

import { CSRFToken } from "../../services/CSRFToken.js";

import {
    configPath,
    dialog,
    notAllowedRedirection,
    redirect,
    scroll,
    type,
    validate,
} from "../../services/utils.js";

/**
 * Fonction principale pour gérer la page de détails d'une liste.
 */
function list() {
    // Obtient l'identifiant de la liste à partir des paramètres de l'URL.
    const urlParams = new URLSearchParams(document.location.search);
    if (urlParams.has("id")) {
        const id = urlParams.get("id");

        fetchReadOneListById(id)
        .then(response => {
            const sectionList = document.querySelector("#listSection");

            const returnHome = document.createElement("a");
            returnHome.id = "returnHome";
            returnHome.innerText = "Revenir à la page d'accueil";
            returnHome.title = "Revenir à la page d'accueil";
            returnHome.href = `${configPath.basePath}/home/pages/home.html`;

            const returnLists = document.createElement("a");
            returnLists.id = "returnLists";
            returnLists.innerText = "Revenir à mes listes";
            returnLists.title = "Revenir à mes listes";
            returnLists.href = `${configPath.basePath}/list/pages/lists.html`;

            const lineBreak = document.createElement("br");

            if(response.message === "ID not numeric" || id === "") {
                redirect(`${configPath.basePath}/home/pages/home.html`, 0)
            }

            if(response.errors === "no list found") {
                // Si aucune liste n'est retrouvée (type === null), redirection vers home.html
                notAllowedRedirection();
            }

            if (localStorage.user === null || localStorage.user === undefined || localStorage.token === null || localStorage.user === undefined){
                localStorage.nav_active ="home";
                const connexion = document.querySelector("#connexion");
                connexion.addEventListener("click", e => {
                    e.preventDefault();
                    redirect(`${configPath.basePath}/user/pages/login.html?id=${id}&redirection`);
                });
            }

            // user de la liste
            const data = response.data;

            localStorage.setItem("userIDList", data.userId);
            localStorage.setItem("userTypeList", data?.type);

            let userId = null;
            let userRole = null;

            if (localStorage.user) {
                userId = JSON.parse(localStorage.user).id; // ID user courant
                userRole = JSON.parse(localStorage.user).role; // Role user courant

                if (userRole === "Admin" && response.data.user.role !== "Admin") {
                    const returnProfil = document.createElement("a");
                    returnProfil.id = "returnProfil";
                    returnProfil.innerText = "Revenir au profil de l'utilisateur";
                    returnProfil.title = "Revenir au profil de l'utilisateur";
                    returnProfil.href = `${configPath.basePath}/user/pages/profil.html?id=${localStorage.userIDList}`;
                    sectionList.firstElementChild.after(returnProfil);

                    returnProfil.addEventListener("click", e => {
                        e.preventDefault();
                        localStorage.nav_active ="home";
                        redirect(`${configPath.basePath}/user/pages/profil.html?id=${localStorage.userIDList}`);
                    })
                }
            }

            sectionList.firstElementChild.after(returnLists);
            sectionList.firstElementChild.after(lineBreak);
            sectionList.firstElementChild.after(returnHome);

            returnLists.addEventListener("click", e => {
                e.preventDefault();
                localStorage.nav_active ="lists";
                redirect(`${configPath.basePath}/list/pages/lists.html`);
            })

            if (response.status === "readOneList") {
                notAllowedRedirection(data?.type);
                const oneList = document.querySelector("#oneList");
                oneList.classList = "list";
                oneList.classList.add("grid");

                const typeList = document.createElement("h3");
                typeList.id = "typeList";
                typeList.classList.add("grid_typeH3")
                typeList.innerText = `${data.type} \n ${data.title}`;

                if (userId !== data.userId) {
                    oneList.classList.add("grid");
                    oneList.classList.add("third_party_wish");
                    dropDownMenu(oneList, data.id, data.updatedAt, data.user.login);
                } else {
                    oneList.classList.add(type[data.type]);
                }

                // Si suppression du type de liste, mettre une couleur grise aux listes
                if (!['WishList', 'TodoList'].includes(data.type)) {
                    oneList.classList.add(type.Common)
                }

                const sectionList = document.createElement("section");
                sectionList.classList.add("grid_text_list");
                sectionList.id = "sectionTxt";

                const text = document.createElement("h4");

                const actionBtnlist = document.createElement("section");
                actionBtnlist.id = "actionBtnList";
                actionBtnlist.classList.add("grid_action_btn_list");

                const updateBtnList = document.createElement("button");
                updateBtnList.id = `updateProfilList-${data.id}`;
                updateBtnList.title = "Modifier la liste";
                updateBtnList.name = "updateProfilList";
                updateBtnList.type = "button";
                updateBtnList.value = `${data.id}`;
                updateBtnList.textContent = "";
                updateBtnList.classList.add("btn");
                updateBtnList.classList.add("edit");
                updateBtnList.classList.add("listBtn");

                const deleteBtnList = document.createElement("button");
                deleteBtnList.id = `deleteProfilList-${data.id}`;
                deleteBtnList.title = "Supprimer la liste";
                deleteBtnList.name = "deleteProfilList";
                deleteBtnList.type = "button";
                deleteBtnList.value = `${data.id}`;
                deleteBtnList.textContent = "";
                deleteBtnList.classList.add("btn");
                deleteBtnList.classList.add("delete");
                deleteBtnList.classList.add("inList");
                deleteBtnList.classList.add("listBtn");

                for (const index in data) {
                    const object = data[index];

                    // Exclut certains éléments de la liste (id, userId, type, title, cards, createdAd)
                    if (["id", "userId", "user", "type", "title", "cards", "createdAt", "updatedAt"].includes(`${index}`)) {
                        continue;
                    };

                    text.innerText = `${object}`;
                    sectionList.appendChild(text);
                    oneList.appendChild(typeList);
                    oneList.appendChild(sectionList);
                    actionBtnlist.appendChild(updateBtnList);
                    actionBtnlist.appendChild(deleteBtnList);
                };

                // Rend visible les boutons "Supprimer" et "Modifier" pour l'utilisateur en cours uniquement
                if (userId === data.user.id) {
                    const actions = [
                        {
                            text : `Modifié par ${data.user.login} \n le ${data.updatedAt}`,
                            onclick: false
                        },
                        {
                            // Gestion de la mise à jour de la liste
                            text: "Modifier",
                            onclick: function(e) {
                                e.preventDefault();
                                const updtBtnListId = parseInt(e.target.value);

                                if (updtBtnListId !== data.id) {
                                    console.warn("pas touche");
                                    return;

                                } else {
                                    actionBtnlist.classList.remove("grid_action_btn_list");
                                    actionBtnlist.classList.add("grid_edit_list");

                                    const updateList = document.createElement("section");
                                    updateList.id = "updateList";

                                    typeList.after(updateList);

                                    // Affichage du formulaire d'édition + dissimulation de la liste
                                    displayFormList(updateList);
                                    const titleFormList = document.querySelector("#titleFormList");
                                    titleFormList.innerText = "Formulaire d'édition de la liste";

                                    // Titre caché
                                    typeList.classList.add("hidden");

                                    // Boutons création de carte, édition et suppression de liste cachés
                                    cardSectionForm.classList.add("hidden");
                                    updateBtnList.hidden = true;
                                    deleteBtnList.hidden = true;

                                    // Description de liste cachée
                                    sectionList.classList.add("hidden");

                                    // Affichage de la liste + suppression du formulaire d'édition
                                    const updateFormList  = document.querySelector("#formList");
                                    cancelForm.addEventListener("click", function() {
                                        // Fermeture du formulaire d'édition + affichage de la liste
                                        actionBtnlist.classList.remove("grid_edit_list");
                                        actionBtnlist.classList.add("grid_action_btn_list");
                                        updateList.remove();

                                        // Titre visible
                                        typeList.classList.remove("hidden");

                                        // Boutons création de carte, édition et suppression de liste visibles
                                        cardSectionForm.classList.remove("hidden");
                                        updateBtnList.hidden = false;
                                        deleteBtnList.hidden = false;

                                        // Description de liste visible
                                        sectionList.classList.remove("hidden");
                                    })

                                    // Insertion des éléments de la liste dans les inputs
                                    if (data.type === "TodoList") {
                                        const selectType = document.querySelector("#typeList");
                                        selectType.value = 0;
                                        const optionTodo = document.querySelector("#optTodoList");
                                        optionTodo.setAttribute("value", "TodoList");
                                        optionTodo.selected = true
                                    };
                                    const inputTitle = document.querySelector("#titleList");
                                    inputTitle.value = data.title;

                                    const inputDescription = document.querySelector("#descriptionList");
                                    inputDescription.value = data.description;

                                    CSRFToken(updateFormList.id);
                                    updateFormList.addEventListener("submit", function(e) {
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
                                        scroll();
                                        fetchUpdateList(updateFormList, data.id)
                                        .then(response => {
                                            localStorage.removeItem("csrfToken");

                                            if (response.status === "updateList") {
                                                dialog({title: "Modification de la liste", content: "Votre liste a bien été mise à jour."});
                                                const dialogMsg = document.querySelector("dialog");
                                                dialogMsg.classList.add("valid");
                                                redirect(`${configPath.basePath}/list/pages/list.html?id=${updtBtnListId}`);
                                            };
                                            if (response.status === "errors") {
                                                dialog({title: "Erreurs", content: response.errors});
                                                const dialogMsg = document.querySelector("dialog");
                                                dialogMsg.classList.add("errors");
                                                redirect(`${configPath.basePath}/list/pages/list.html?id=${updtBtnListId}`);
                                            };
                                        });
                                    });
                                };
                            }
                        },
                        {
                            // Gestion de la suppression de la liste
                            text: "Supprimer",
                            onclick: function(e){
                                e.preventDefault();
                                const dltBtnId = parseInt(e.target.value);

                                if (dltBtnId !== data.id) {
                                    console.warn("pas touche");
                                    return;

                                } else if (confirm('Voulez-vous vraiment vous supprimer la liste ?') === true) {
                                    scroll();
                                    fetchDeleteList(data.id)
                                    .then(() => {
                                        if (localStorage.getItem("userTypeList") === "WishList"){
                                            dialog({title: "Suppression de la liste souhait", content: "Votre liste a bien été supprimée."});
                                        } else {
                                            dialog({title: "Suppression de la liste de tâche", content: "Votre liste a bien été supprimée."});
                                        }

                                        const dialogMsg = document.querySelector("dialog");
                                        dialogMsg.classList.add("valid");
                                        document.body.scrollTop = 0;
                                        redirect(`${configPath.basePath}/list/pages/lists.html`);
                                    });
                                };
                            }
                        },
                    ]
                    dropDownMenu(oneList, data.id, data.updatedAt, data.user.login, actions);
                };

                card(userId === data?.user.id, updateBtnList, deleteBtnList);
            };
        })
        // Permet de récupérer les erreurs du .then
        .catch(e=>console.error(e))
    }
};

document.addEventListener("DOMContentLoaded", () => {
    list();
});
