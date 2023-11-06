"use strict";

import { fetchReadOneListById, fetchDeleteList, fetchUpdateList } from "../../actions/actions_lists.js";
import { CSRFToken } from "../../services/CSRFToken.js";
import { configPath, redirect, dialog } from "../../services/utils.js";
import { createUpdateForm } from "./update_form_list.js";
import { card } from "../../card/js/card.js";

/**
 * Fonction principale pour gérer la page de détails d'une liste.
 */
function list() {
    const urlParams = new URLSearchParams(document.location.search);
    if (urlParams.has("id")) {
        // Obtient l'identifiant de la liste à partir des paramètres de l'URL.
        const id = urlParams.get("id");

        fetchReadOneListById(id)
        .then(response => {
            const data = response.data; // user de la liste

            localStorage.setItem("typeList", data.type);
            const userId = JSON.parse(localStorage.user).id; // user courant

            if (response.status === "readOneList") {
                const updateList = document.querySelector("#updateList");
                updateList.id = "updateList";
                updateList.classList.add("updateList");
                updateList.classList.add("hidden");

                const oneList = document.querySelector("#oneList");
                oneList.id = "oneList";
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

                localStorage.setItem("canCreateCard", userId === data.user.id)
                if (userId === data.user.id) {

                    oneList.appendChild(deleteBtnList);
                    oneList.appendChild(updateBtnList);

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

                    // Gestion de la mise à jour de la liste
                    createUpdateForm(updateList);
                    CSRFToken(updateFormList.id);

                    updateBtnList.addEventListener("click", function(e) {
                        e.preventDefault();
                        const updtBtnId = parseInt(e.target.value);

                        if (updtBtnId !== data.id) {
                            console.warn("pas touche");
                            return;

                        } else {
                            updateList.classList.remove("hidden");
                            oneList.classList.add("hidden");

                            if (data.type === "TodoList") {
                                const radio = document.querySelector("#todo");
                                radio.checked = true;
                            };

                            const inputTitle = document.querySelector("#title");
                            inputTitle.value = `${data.title}`;

                            const inputDescription = document.querySelector("#description");
                            inputDescription.value = `${data.description}`;

                            const updateFormList  = document.querySelector("#updateFormList");

                            const listCancelBtn = document.querySelector("#updateBtnListCancel");
                            listCancelBtn.addEventListener("click", function(){
                                inputTitle.value = "";
                                inputDescription.value = "";
                            })

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
                };
            };
            card(userId === data.user.id);
        });

    };
};

document.addEventListener("DOMContentLoaded", () => {
    list();
});
