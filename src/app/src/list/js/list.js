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
    dialog
} from "../../services/utils.js";
import { createUpdateForm } from "./update_form_list.js";
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
            const data = response.data; // user de la liste

            localStorage.setItem("typeList", data.type);
            const userId = JSON.parse(localStorage.user).id; // user courant

            if (response.status === "readOneList") {
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
                        const updtBtnId = parseInt(e.target.value);
                        if (updtBtnId !== data.id) {
                            console.warn("pas touche");
                            return;

                        } else {
                            const updateList = document.createElement("section");
                            updateList.id = "updateList";
                            updateList.classList.add("updateList");
                            deleteBtnList.after(updateList);


                            // Affichage du formulaire d'édition + dissimulation de la liste
                            createUpdateForm(updateList);
                            oneList.classList.add("hidden");
                            updateBtnList.disabled = true;
                            deleteBtnList.disabled = true;

                            // Affichage de la liste + suppression du formulaire d'édition
                            const updateFormList  = document.querySelector("#updateFormList");
                            const listCancelBtn = document.querySelector("#updateBtnListCancel");
                            listCancelBtn.addEventListener("click", function(){
                                updateList.remove();
                                updateFormList.remove();
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
                            inputTitle.value = `${data.title}`;

                            const inputDescription = document.querySelector("#descriptionList");
                            inputDescription.value = `${data.description}`;

                            CSRFToken(updateFormList.id);
                            updateFormList.addEventListener("submit", function(e) {
                                e.preventDefault();

                                fetchUpdateList(updateFormList, data.id)
                                .then((response) => {
                                    localStorage.removeItem("csrfToken");

                                    if (response.status === "updated") {
                                        dialog({title: "Modification de la liste", content: "Votre liste a bien été mise à jour."});
                                        redirect(`${configPath.basePath}/list/pages/list.html?id=${updtBtnId}`);
                                    };
                                    if (response.status === "fail") {
                                        dialog({title: "Erreurs", content: response.errors, hasTimeOut: true});
                                        redirect(`${configPath.basePath}/list/pages/list.html?id=${updtBtnId}`);
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
            };
            card(userId === data.user.id);
        });
    };
};

document.addEventListener("DOMContentLoaded", () => {
    list();
});
