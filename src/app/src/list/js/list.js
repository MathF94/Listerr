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
    dialog,
    notAllowedRedirection,
    validate
} from "../../services/utils.js";
import { displayFormList } from "./form_list.js";
import { card } from "../../card/js/card.js";

notAllowedRedirection();

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
            const returnLists = document.querySelector("#cancelBtn");
            returnLists.title = "Revenir aux listes";
            returnLists.href = `${configPath.basePath}/list/pages/lists.html`;

            if (JSON.parse(localStorage.user).role === "Admin" && response.data.user.role !== "Admin") {
                returnLists.href = `${configPath.basePath}/user/pages/profil.html?id=${response.data.userId}`;
            }

            if(response.message === "ID not numeric" || id === "") {
                redirect(`${configPath.basePath}/home/pages/home.html`, 0)
            }
            if(response.errors === "no list found") {
                // Si aucune liste n'est retrouvée (type === null), redirection vers home.html
                notAllowedRedirection();
            }
            const data = response.data; // user de la liste
            let userId = null;

            localStorage.setItem("typeList", data?.type);
            if (localStorage.user) {
                userId = JSON.parse(localStorage.user).id; // user courant
            }

            if (response.status === "readOneList") {
                notAllowedRedirection(data?.type);
                const oneList = document.querySelector("#oneList");
                oneList.classList = "list";

                const typeList = document.createElement("h3");
                typeList.innerText = `${data.type}`;

                const sectionList = document.createElement("section");
                sectionList.classList.add("flex");

                const titleList = document.createElement("h4");
                titleList.innerText = `${data.title}`;
                sectionList.appendChild(titleList);

                const text = document.createElement("p");

                const actionBtn = document.createElement("div");

                const updateBtnList = document.createElement("button");
                updateBtnList.id = `updateProfilList-${data.id}`;
                updateBtnList.title = "Modifier la liste";
                updateBtnList.name = "updateProfilList";
                updateBtnList.type = "button";
                updateBtnList.value = `${data.id}`;
                updateBtnList.textContent = "";
                updateBtnList.classList.add("btn");
                updateBtnList.classList.add("edit");

                const deleteBtnList = document.createElement("button");
                deleteBtnList.id = `deleteProfilList-${data.id}`;
                deleteBtnList.title = "Supprimer la liste";
                deleteBtnList.name = "deleteProfilList";
                deleteBtnList.type = "button";
                deleteBtnList.value = `${data.id}`;
                deleteBtnList.textContent = "";
                deleteBtnList.classList.add("btn");
                deleteBtnList.classList.add("delete");

                for (const index in data) {
                    const object = data[index];
                    if ( index === "user" && typeof(data[index]) === "object") {
                        const small = document.createElement("small");
                        small.innerText = `Par ${data.user.login}`;
                        sectionList.appendChild(small);
                    } else {
                        if (index === "updatedAt") {
                            const small = document.createElement("small");
                            small.innerText = `Dernière modification le ${data.updatedAt}`;
                            sectionList.appendChild(small);
                        };
                    };

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
                localStorage.setItem("canCreateCard", userId === data.user.id)
                if (userId === data.user.id) {
                    oneList.appendChild(actionBtn);
                    actionBtn.appendChild(updateBtnList);
                    actionBtn.appendChild(deleteBtnList);

                    // Gestion de la mise à jour de la liste
                    updateBtnList.addEventListener("click", function(e) {
                        e.preventDefault();
                        const updtBtnListId = parseInt(e.target.value);
                        if (updtBtnListId !== data.id) {
                            console.warn("pas touche");
                            return;

                        } else {
                            const updateList = document.createElement("section");
                            updateList.id = "updateList";
                            updateList.classList.add("updateList");
                            deleteBtnList.after(updateList);

                            // Affichage du formulaire d'édition + dissimulation de la liste
                            displayFormList(updateList);
                            titleFormList.innerText = "Formulaire d'édition de la liste";
                            oneList.classList.add("hidden");
                            updateBtnList.disabled = true;
                            deleteBtnList.disabled = true;

                            // Affichage de la liste + suppression du formulaire d'édition
                            const updateFormList  = document.querySelector("#formList");
                            cancelForm.addEventListener("click", function(){
                                updateList.remove();
                                updateBtnList.disabled = false;
                                deleteBtnList.disabled = false;
                                oneList.classList.remove("hidden");
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
                                        dialog({title: "Erreurs", content: response.errors, hasTimeOut: true});
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
                                dialog({title: "Suppression de la liste", content: `<p>Votre liste a bien été supprimée.</p>`});
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
        .catch(e=>console.error(e))
    }
};

document.addEventListener("DOMContentLoaded", () => {
    list();
});
