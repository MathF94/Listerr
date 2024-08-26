"use strict";

import {
    fetchReadOneListById,
    fetchDeleteList,
    fetchUpdateList
} from "../../actions/actions_lists.js";
import { CSRFToken } from "../../services/CSRFToken.js";
import {
    configPath,
    redirect,
    type,
    dialog,
    toolTip,
    notAllowedRedirection,
    validate,
    scroll
} from "../../services/utils.js";
import { displayFormList } from "./form_list.js";
import { card } from "../../card/js/card.js";

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
            const returnHome = document.querySelector("#returnBtn");
            returnHome.title = "Revenir à la page d'accueil";
            returnHome.href = `${configPath.basePath}/home/pages/home.html`;

            const returnLists = document.querySelector("#cancelBtn");
            returnLists.title = "Revenir aux listes";
            returnLists.href = `${configPath.basePath}/list/pages/lists.html`;

            if(response.message === "ID not numeric" || id === "") {
                redirect(`${configPath.basePath}/home/pages/home.html`, 0)
            }

            if(response.errors === "no list found") {
                // Si aucune liste n'est retrouvée (type === null), redirection vers home.html
                notAllowedRedirection();
            }

            const data = response.data; // user de la liste

            localStorage.setItem("userList", data.userId);

            let userId = null;
            let userRole = null;

            localStorage.setItem("typeList", data?.type);

            if (localStorage.user) {
                userId = JSON.parse(localStorage.user).id; // ID user courant
                userRole = JSON.parse(localStorage.user).role; // Role user courant
                if (userRole === "Admin" && response.data.user.role !== "Admin") {
                    returnLists.href = `${configPath.basePath}/user/pages/profil.html?id=${response.data.userId}`;
                }
            }

            if (response.status === "readOneList") {
                notAllowedRedirection(data?.type);
                const oneList = document.querySelector("#oneList");
                oneList.classList = "list";
                oneList.classList.add("grid");

                const typeList = document.createElement("h3");
                typeList.classList.add("grid_typeH3_list")
                typeList.innerText = `${data.type} - ${data.title}`;

                if(userId !== data.userId) {
                    oneList.classList.add("grid");
                    oneList.classList.add("third_party_wish");
                } else {
                    oneList.classList.add(type[data.type]);
                }

                // Si suppression du type de liste, mettre une couleur grise aux listes
                if(!['WishList', 'TodoList'].includes(data.type)) {
                    oneList.classList.add(type.Common)
                }

                toolTip(oneList, data.id, data.updatedAt, data.user.login)

                const sectionList = document.createElement("section");
                sectionList.classList.add("grid_text_list");
                sectionList.id = "sectionTxt";

                const text = document.createElement("p");
                const actionBtnlist = document.createElement("section");
                actionBtnlist.id = "actionBtnList";
                actionBtnlist.classList.add("grid_action_btn_lists");

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

                    oneList.appendChild(actionBtnlist);

                    // Gestion de la mise à jour de la liste
                    updateBtnList.addEventListener("click", function(e) {
                        e.preventDefault();
                        const updtBtnListId = parseInt(e.target.value);

                        if (updtBtnListId !== data.id) {
                            console.warn("pas touche");
                            return;

                        } else {
                            actionBtnlist.classList.remove("grid_action_btn_lists");
                            actionBtnlist.classList.add("grid_edit_list");

                            const updateList = document.createElement("section");
                            updateList.id = "updateList";

                            deleteBtnList.after(updateList);

                            // Affichage du formulaire d'édition + dissimulation de la liste
                            displayFormList(updateList);
                            titleFormList.innerText = "Formulaire d'édition de la liste";
                            oneList.classList.add("hidden");
                            updateBtnList.disabled = true;
                            updateBtnList.classList.remove("edit");
                            updateBtnList.classList.add("disableUpdate");

                            deleteBtnList.disabled = true;
                            deleteBtnList.classList.remove("delete");
                            deleteBtnList.classList.add("disableDelete");
                            sectionList.classList.add("hidden");

                            // Affichage de la liste + suppression du formulaire d'édition
                            const updateFormList  = document.querySelector("#formList");
                            cancelForm.addEventListener("click", function(){
                                updateList.remove();
                                updateBtnList.disabled = false;
                                updateBtnList.classList.remove("disableUpdate");
                                updateBtnList.classList.add("edit");

                                deleteBtnList.disabled = false;
                                deleteBtnList.classList.remove("disableDelete");
                                deleteBtnList.classList.add("delete");

                                oneList.classList.remove("hidden");
                                sectionList.classList.remove("hidden");
                                actionBtnlist.classList.remove("grid_edit_list");
                                actionBtnlist.classList.add("grid_action_btn_lists");
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
                    });

                    // Gestion de la suppression de la liste
                    deleteBtnList.addEventListener("click", function(e){
                        e.preventDefault();
                        const dltBtnId = parseInt(e.target.value);

                        if (dltBtnId !== data.id) {
                            console.warn("pas touche");
                            return;

                        } else if (confirm('Voulez-vous vraiment vous supprimer la liste ?') === true) {
                            scroll();
                            fetchDeleteList(data.id)
                            .then(() => {
                                if (localStorage.getItem("typeList") === "WishList"){
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
                    });
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
