"use strict";

import { fetchReadOneListById, fetchDeleteList, fetchUpdateList } from "../../actions/actions_lists";
import { configPath } from "../../services/config.js";
import { CSRFToken } from "../../services/CSRFToken.js";
import { redirect, dialog } from "../../services/utils.js";
import { createUpdateForm } from "./form.js";

function list() {
    const urlParams = new URLSearchParams(document.location.search);
    if (urlParams.has("id")) {
        const id = urlParams.get("id");

        fetchReadOneListById(id)
        .then(response => {
            const data = response.data;
            const userId = response.user_id;

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

                const card = document.createElement("div");
                card.id = "newCard";
                card.class = "newCard";

                const createCardBtn = document.createElement("button");
                createCardBtn.id = `card-id`;
                createCardBtn.name = "newCard";
                createCardBtn.type = "button";
                createCardBtn.value = `newCard`;

                if (data.type === "TodoList") {
                    createCardBtn.textContent = "Première tâche !";
                } else {
                createCardBtn.textContent = "Faites un voeu !";
                }

                const creatCardBtn = document.createElement("button");

                for (const index in data) {
                    const item = document.createElement("li");
                    const object = data[index];

                    if (["id", "userId", "type", "title"].includes(`${index}`)) {
                        continue;
                    }
                    if ( index === "user" && typeof(data[index]) === "object") {
                        item.innerText = `Par ${data.user.login}`;
                    } else {
                        if (index === "createdAt") {
                            item.innerText = `Créée le ${data.createdAt}`;
                        } else if (index === "updatedAt") {
                            item.innerText = `Modifiée le ${data.updatedAt}`;
                        } else {
                            item.innerText = `${object}`;
                        }
                    }

                    list.appendChild(item);
                    oneList.appendChild(titleList);
                    oneList.appendChild(list);
                }
                if (userId !== data.userId) {
                    console.log("pas touche");

                } else {
                    oneList.appendChild(deleteBtnList);
                    oneList.appendChild(updateBtnList);
                    oneList.appendChild(card);
                    card.appendChild(createCardBtn);

                    /**
                     * DELETE
                     */
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
                        }
                    })

                    /**
                     * UPDATE
                    */
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

                            const inputTitle = document.querySelector("#title");
                            inputTitle.value = `${data.title}`;

                            const inputDescription = document.querySelector("#description");
                            inputDescription.value = `${data.description}`;

                            const updateBtnListCancel = document.querySelector("#updateBtnListCancel");
                            const updateFormList  = document.querySelector("#updateFormList");

                            updateFormList.addEventListener("submit", function(e) {
                                e.preventDefault();

                                if (e.submitter.value === "updateBtnListCancel") {
                                    redirect(`${configPath.basePath}/list/pages/list.html?id=${updtBtnId}`, 0);
                                    updateList.classList.add("hidden");
                                    oneList.classList.remove("hidden");
                                }

                                fetchUpdateList(updateFormList, data.id)
                                .then((response) => {
                                    localStorage.removeItem("csrfToken");

                                    if (response.status === "updated") {
                                        dialog({content: "Votre liste a bien été mise à jour."});
                                        redirect(`${configPath.basePath}/list/pages/list.html?id=${updtBtnId}`, 2000);
                                    }
                                    if (response.status === "fail") {
                                        dialog({title: "Erreurs", content: response.errors, hasTimeOut: true});
                                        redirect(`${configPath.basePath}/list/pages/list.html?id=${updtBtnId}`, 2000);
                                    };
                                })
                            })
                        }
                    })
                }
            }
        })
    }
}

document.addEventListener("DOMContentLoaded", () => {
    list();
});
