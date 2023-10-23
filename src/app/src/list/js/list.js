"use strict";

import { fetchReadOneListById, fetchDeleteList } from "./actions.js";
import { redirect, dialog } from "../../services/utils.js";

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

                const updateFormList = document.createElement("form");
                updateFormList.id = "updateFormList";

                const titleForm = document.createElement("h3");
                titleForm.innerText = "Formulaire d'édition de la liste";

                const radioW = document.createElement("input");
                radioW.type = "radio";
                radioW.name = "type";
                radioW.id = "wish";
                radioW.value = "WishList";
                radioW.checked = true;

                const labelW = document.createElement("label");
                labelW.for = "wish";
                labelW.innerText = "WishList";

                const radioT = document.createElement("input");
                radioT.type = "radio";
                radioT.name = "type";
                radioT.id = "todo";
                radioT.value = "TodoList";

                const labelT = document.createElement("label");
                labelT.for = "todo";
                labelT.innerText = "TodoList";

                const labelTitle = document.createElement("label");
                labelTitle.for = "title";
                labelTitle.innerText = "Titre de la liste";

                const inputTitle = document.createElement("input");
                inputTitle.type = "text";
                inputTitle.name = "title";
                inputTitle.id = "title";
                inputTitle.placeholder = "Votre titre";
                inputTitle.required = true;

                const inputDescription = document.createElement("input");
                inputDescription.type = "text";
                inputDescription.name = "title";
                inputDescription.id = "description";
                inputDescription.placeholder = "Votre description";

                const labelDescription = document.createElement("label");
                labelDescription.for = "description";
                labelDescription.innerText = "Description (facultative)";

                const updateBtnListValid = document.createElement("button");
                updateBtnListValid.type = "button";
                updateBtnListValid.innerText = "Valider";
                const updateBtnListCancel = document.createElement("button");
                updateBtnListCancel.type = "button";
                updateBtnListCancel.innerText = "Annuler";

                const oneList = document.querySelector("#oneList");
                oneList.id = "oneList";
                oneList.class = "oneList";

                const titleList = document.createElement("h3");
                titleList.innerText = `${data.type} - ${data.title}`;

                const list = document.createElement("ul");

                const updateBtnList = document.createElement("button");
                updateBtnList.id = `updateProfilList-${data.id}`;
                updateBtnList.name = "updateProfilList";
                updateBtnList.type = "button";
                updateBtnList.value = `${data.id}`;
                updateBtnList.textContent = "Modifier";
                updateBtnList.classList.add("hidden");

                const deleteBtnList = document.createElement("button");
                deleteBtnList.id = `deleteProfilList-${data.id}`;
                deleteBtnList.name = "deleteProfilList";
                deleteBtnList.type = "button";
                deleteBtnList.value = `${data.id}`;
                deleteBtnList.textContent = "Supprimer";
                deleteBtnList.classList.add("hidden");

                const card = document.createElement("div");
                card.id = "card-id";
                card.class = "card-id";
                card.innerText = "cartes à partir d'ici";

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

                    updateList.appendChild(titleForm);
                    updateList.appendChild(updateFormList);
                    updateFormList.appendChild(radioW);
                    updateFormList.appendChild(labelW);
                    updateFormList.appendChild(radioT);
                    updateFormList.appendChild(labelT);
                    updateFormList.appendChild(labelTitle);
                    updateFormList.appendChild(inputTitle);
                    updateFormList.appendChild(labelDescription);
                    updateFormList.appendChild(inputDescription);
                    updateFormList.appendChild(updateBtnListValid);
                    updateFormList.appendChild(updateBtnListCancel);

                    list.appendChild(item);
                    oneList.appendChild(titleList);
                    oneList.appendChild(list);
                    oneList.appendChild(deleteBtnList);
                    oneList.appendChild(updateBtnList);
                    oneList.appendChild(card);
                }
                if (userId !== data.userId) {
                    console.log("pas touche");

                } else {
                    deleteBtnList.classList.remove("hidden");
                    updateBtnList.classList.remove("hidden");

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
                                redirect('http://localhost/listerr/src/app/src/list/pages/lists.html', 2000);
                            });
                        }
                    })

                    /**
                     * UPDATE
                    */
                    updateBtnList.addEventListener("click", function(e) {
                        e.preventDefault();

                        const updtBtnId = parseInt(e.target.value);
                        if (updtBtnId !== data.id) {
                            console.warn("pas touche");
                            return;
                        } else {
                            updateList.classList.remove("hidden");
                            oneList.classList.add("hidden");
                            inputTitle.value = `${data.title}`;
                            inputDescription.value = `${data.description}`;



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
