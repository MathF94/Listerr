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
    notAllowedRedirection
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
            if (JSON.parse(localStorage.user).role === "Admin") {
                returnLists.href = `${configPath.basePath}/user/pages/profil.html?id=${response.data.userId}`;
            } else {
                returnLists.href = `${configPath.basePath}/user/pages/profil.html`;
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
                oneList.classList = "oneList";

                const titleList = document.createElement("h3");
                titleList.innerText = `${data.type} - ${data.title}`;

                const list = document.createElement("ul");

                const updateBtnList = document.createElement("button");
                updateBtnList.id = `updateProfilList-${data.id}`;
                updateBtnList.name = "updateProfilList";
                updateBtnList.type = "button";
                updateBtnList.value = `${data.id}`;
                updateBtnList.textContent = "Modifier";

                const deleteBtnList = document.createElement("button");
                deleteBtnList.id = `deleteProfilList-${data.id}`;
                deleteBtnList.name = "deleteProfilList";
                deleteBtnList.type = "button";
                deleteBtnList.value = `${data.id}`;
                deleteBtnList.textContent = "Supprimer";

                for (const index in data) {
                    const item = document.createElement("li");
                    const object = data[index];
                    // Exclut certains éléments de la liste (id, userId, type, title)
                    if (["id", "userId", "type", "title", "cards"].includes(`${index}`)) {
                        continue;
                    };
                    if ( index === "user" && typeof(data[index]) === "object") {
                        item.innerText = `Par ${data.user.login}`;
                    } else {
                        if (index === "createdAt") {
                            item.innerText = `Créée le ${data.createdAt}`;
                        } else if (index === "updatedAt") {
                            item.innerText = `Modifiée le ${data.updatedAt}`;
                        } else {
                            item.innerText = `${object}`;
                        };
                    };

                    list.appendChild(item);
                    oneList.appendChild(titleList);
                    oneList.appendChild(list);
                };
                // Rend visible les boutons "Supprimer" et "Modifier" pour l'utilisateur en cours uniquement
                localStorage.setItem("canCreateCard", userId === data.user.id)
                if (userId === data.user.id) {
                    oneList.appendChild(updateBtnList);
                    oneList.appendChild(deleteBtnList);

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
                                const radio = document.querySelector("#todo");
                                radio.checked = true;
                            };
                            const inputTitle = document.querySelector("#titleList");
                            inputTitle.value = data.title;

                            const inputDescription = document.querySelector("#descriptionList");
                            inputDescription.value = data.description;

                            CSRFToken(updateFormList.id);
                            updateFormList.addEventListener("submit", function(e) {
                                e.preventDefault();

                                fetchUpdateList(updateFormList, data.id)
                                .then(response => {
                                    localStorage.removeItem("csrfToken");

                                    if (response.status === "updateList") {
                                        dialog({title: "Modification de la liste", content: "Votre liste a bien été mise à jour."});
                                        redirect(`${configPath.basePath}/list/pages/list.html?id=${updtBtnListId}`);
                                    };
                                    if (response.status === "errors") {
                                        dialog({title: "Erreurs", content: response.errors, hasTimeOut: true});
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
                            fetchDeleteList(data.id)
                            .then(() => {
                                dialog({title: "Suppression de la liste",
                                content: `<p>Votre liste a bien été supprimée.</p>`
                                });
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
