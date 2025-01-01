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
    detail,
    dialog,
    manageBtns,
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

            const popIn = document.createElement("div");
            popIn.id = "popIn";
            popIn.classList.add("popIn");
            sectionList.appendChild(popIn);

            if (response.status === "readOneList") {
                notAllowedRedirection(data?.type);
                const oneList = document.querySelector("#oneList");
                oneList.classList = "list";
                oneList.classList.add("grid");

                const typeList = document.createElement("h3");
                typeList.id = `typeList-${data.id}`;
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
                };

                // Rend visible les boutons "Supprimer" et "Modifier" pour l'utilisateur en cours uniquement
                if (userId === data.user.id) {
                    const actions = [
                        {
                            id: `detailList-${data.id}`,
                            text : detail(data.updatedAt, data.user.login),
                            onclick: false
                        },
                        {
                            // Gestion de la mise à jour de la liste
                            id: `updateList-${data.id}`,
                            text: "Modifier la liste",
                            onclick: function(e) {
                                e.preventDefault();
                                const updtBtnListId = parseInt(e.target.value);

                                if (updtBtnListId !== data.id) {
                                    console.warn("pas touche");
                                    return;

                                } else {
                                    const cardsArray = data.cards
                                    const updateListDiv = document.createElement("div");
                                    updateListDiv.id = "updateListDiv";
                                    popIn.style.visibility = "visible";

                                    const dropDown = document.querySelector(`#dropDown-${data.id}`)
                                    dropDown.classList.remove('show__more__menu');

                                    popIn.appendChild(updateListDiv);

                                    // Affichage du formulaire d'édition + dissimulation de la liste
                                    displayFormList(updateListDiv);

                                    const titleFormList = document.querySelector("#titleFormList");
                                    titleFormList.innerText = "Formulaire d'édition de la liste";

                                    // Affichage de la liste + suppression du formulaire d'édition
                                    const updateFormList  = document.querySelector("#formList");

                                    // Fermeture du formulaire d'édition + affichage de la liste
                                    cancelForm.addEventListener("click", function() {
                                        popIn.style.visibility = "hidden";
                                        updateListDiv.remove();

                                        // Titre visible
                                        typeList.classList.remove("hidden");

                                        // Description de liste visible
                                        sectionList.classList.remove("hidden");

                                        cardsArray.forEach(cardArray => {
                                            const reservationBtns = document.querySelectorAll(`#reservationBtn-${cardArray.id}`);
                                            const priorityBtns = document.querySelectorAll('.disableStars');

                                            reservationBtns.forEach(reservationBtn => {
                                                reservationBtn.classList.remove('disable');
                                                reservationBtn.classList.add('reservation');
                                                reservationBtn.disabled = false;
                                            });

                                            priorityBtns.forEach(priorityBtn => {
                                                priorityBtn.classList.remove('disableStars');
                                                priorityBtn.classList.add('stars');
                                                priorityBtn.disabled = false;
                                            })
                                        });
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

                                    const textAreaDescription = document.querySelector("#descriptionList");
                                    textAreaDescription.value = data.description;

                                    CSRFToken(updateFormList.id);
                                    updateFormList.addEventListener("submit", function(e) {
                                        e.preventDefault();

                                        // Validation de pattern du formulaire
                                        const inputTitle = document.querySelector("#titleList");
                                        const textAreaDescription = document.querySelector("#descriptionList");
                                        const selectType = document.querySelector("#typeList")
                                        inputTitle.addEventListener("invalid", function(e) {
                                            validate(e.target)
                                        });
                                        textAreaDescription.addEventListener("invalid", function(e) {
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
                            id: `deleteList-${data.id}`,
                            text: "Supprimer la liste",
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

                card(userId === data?.user.id);
            };
        })
        // Permet de récupérer les erreurs du .then
        .catch(e=>console.error(e))
    }
};

document.addEventListener("DOMContentLoaded", () => {
    list();
});
