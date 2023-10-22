"use strict";

import { fetchCreateList, fetchReadAllLists, fetchDeleteList } from "./actions.js";
import { redirect, dialog } from "../../services/utils.js";

function lists() {
    const form = document.querySelector("form");
    form.addEventListener("submit", function(e){
        e.preventDefault();

        fetchCreateList(form)
        .then(response => {
            if (response.status === "success") {
                dialog({title: "Et une liste de créée, une !", content:"aux cartes maintenant !"});
                redirect("http://localhost/listerr/src/app/src/list/pages/lists.html");

            }
            if (response.status === "fail") {
                dialog({title: "Erreurs", content: response.errors, hasTimeOut: true});
                redirect("http://localhost/listerr/src/app/src/list/pages/lists.html");
            };
        })
    })

    fetchReadAllLists()
    .then(response => {
        const data = response.data;
        if (response.status === "read"){
            const listWrapper = document.querySelector('#listsWrapper');

            for (const index in data) {
                const object = data[index]
                const profilList = document.createElement("div");
                profilList.id = `profilList-${object.id}`;
                profilList.classList.add("profilList");

                const contentList = document.createElement("div");
                contentList.id = `contentList-${object.id}`;
                contentList.classList.add("contentList");

                const titleH3 = document.createElement("h3");
                const list = document.createElement("ul");

                const formDelete = document.createElement("form");
                formDelete.id = `deleteForm-${object.id}`;
                formDelete.action = `?route=delete_list`;
                formDelete.method = "post";
                
                const deleteBtn = document.createElement("button");
                deleteBtn.id = `deleteProfilList-${object.id}`;
                deleteBtn.name = "deleteProfilList";
                deleteBtn.type = "submit";
                deleteBtn.value = `${object.id}`;
                deleteBtn.textContent = "Supprimer";
                deleteBtn.classList.add("deleteProfilList");

                for (const key in object) {
                    const value = object[key];
                    const item = document.createElement("li");
                    
                    if (key === "type") {
                        titleH3.innerText = object.type;
                    }
                    if (["status", "id", "userId", "type"].includes(`${key}`)) {
                        continue;
                    }
                    if (key === "user" && typeof(value) === "object") {
                        item.innerText = `Par ${object[key].login}.`;
                    }
                    else {
                        if (key === "createdAt") {
                            item.innerText = `Créée le ${object[key]}`;
                        } else if (key === "updatedAt")  {
                            item.innerText = `Modifiée le ${object[key]}`;
                        } else {
                            item.innerText = `${object[key]}`;
                        }
                    }

                    contentList.appendChild(titleH3);
                    list.appendChild(item);
                    contentList.appendChild(list);
                    profilList.appendChild(contentList);
                    profilList.appendChild(formDelete);                
                    formDelete.appendChild(deleteBtn);
                    listWrapper.append(profilList);
                }
                
                formDelete.addEventListener("submit", function(e){
                    e.preventDefault();
                    const btnId = parseInt(e.target.deleteProfilList.value);
                    
                    if (btnId !== object.id) {
                        console.warn("pas touche");
                        return;
                    } else if (confirm('Voulez-vous vraiment vous supprimer la liste ?') === true) {
                        fetchDeleteList(object.id)
                        .then(response => {                            
                            dialog({title: "Suppression de la liste",
                            content: `<p>Votre liste a bien été supprimée.</p>`
                            });
                            redirect('http://localhost/listerr/src/app/src/list/pages/lists.html', 2000);
                        });
                    }
                })
                contentList.addEventListener("click", function(){
                    if (object.type === "WishList") {
                    redirect(`http://localhost/listerr/src/app/src/list/pages/list.html?id=${object.id}`, 0);
                    }
                })
            }
        }
    })
}

document.addEventListener("DOMContentLoaded", () => {
    lists();
});
