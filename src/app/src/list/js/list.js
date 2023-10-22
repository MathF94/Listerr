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
                const oneList = document.querySelector("#OneList");
                oneList.id = "oneList";
                oneList.class = "oneList";
                
                const titleH3 = document.createElement("h3");
                titleH3.innerText = data.type
                const list = document.createElement("ul");
                
                const formDelete = document.createElement("form");
                formDelete.id = `deleteForm-${data.id}`;
                formDelete.action = `?route=delete_list`;
                formDelete.method = "post";

                const updateBtn = document.createElement("button");
                updateBtn.id = `updateProfilList-${data.id}`;
                updateBtn.name = "updateProfilList";
                updateBtn.type = "submit";
                updateBtn.value = `${data.id}`;
                updateBtn.textContent = "Modifier";
                updateBtn.classList.add("updateProfilList");

                const deleteBtn = document.createElement("button");
                deleteBtn.id = `deleteProfilList-${data.id}`;
                deleteBtn.name = "deleteProfilList";
                deleteBtn.type = "submit";
                deleteBtn.value = `${data.id}`;
                deleteBtn.textContent = "Supprimer";
                
                const card = document.createElement("div");
                card.id = "card-id";
                card.class = "card-id";
                card.innerText = "cartes à partir d'ici";

                
                for (const index in data) {
                    const item = document.createElement("li");
                    const object = data[index];

                    if (["id", "userId", "type"].includes(`${index}`)) {
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
                    oneList.appendChild(titleH3);
                    oneList.appendChild(list);
                    oneList.appendChild(formDelete);
                    formDelete.appendChild(deleteBtn);
                    oneList.appendChild(updateBtn);
                    oneList.appendChild(card);
                }
                console.log(userId);
                console.log(data.user.login);
                
                formDelete.addEventListener("submit", function(e){
                    e.preventDefault();
                    if (userId !== data.userId) {
                        deleteBtn.classList.add("hidden");
                        // En attendant le CSS 
                        dialog({title: "Authentification",
                        content: `Vous n'êtes pas autorisé(e) à supprimer / modifier la liste de ${data.user.login}`,
                        hasTimeOut: true})
                    } else {
                        const btnId = parseInt(e.target.deleteProfilList.value);
                        if (btnId !== data.id) {
                            console.warn("pas touche");
                            return;
                        } else if (confirm('Voulez-vous vraiment vous supprimer la liste ?') === true) {
                            fetchDeleteList(data.id)
                            .then(response => {                            
                                dialog({title: "Suppression de la liste",
                                content: `<p>Votre liste a bien été supprimée.</p>`
                                });
                                redirect('http://localhost/listerr/src/app/src/list/pages/lists.html', 2000);
                            });
                        }
                    }
                })

            }
        })
    }
}

document.addEventListener("DOMContentLoaded", () => {
    list();
});
