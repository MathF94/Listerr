"use strict";

import { CSRFToken } from "../../services/CSRFToken.js";
import { fetchCreateList, fetchReadAllLists, fetchDeleteList } from "./actions.js";
import { redirect, dialog } from "../../services/utils.js";

function lists() {
    const createList = document.querySelector("#listCreater");
    const listForm = document.querySelector("#listForm");
    const cancelForm = document.querySelector("#cancelForm");

    createList.addEventListener("click", function(){
        if (createList.value === "newList") {
            listForm.classList.remove("hidden");
        }
    })
    cancelForm.addEventListener("click", function(){
        listForm.classList.add("hidden");
    })

    createListForm.addEventListener("submit", function(e){
        e.preventDefault();

        fetchCreateList(createListForm)
        .then(response => {
            localStorage.removeItem("csrfToken");
            
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

                const deleteBtnLists = document.createElement("button");
                deleteBtnLists.id = `deleteProfilList-${object.id}`;
                deleteBtnLists.name = "deleteProfilList";
                deleteBtnLists.type = "submit";
                deleteBtnLists.value = `${object.id}`;
                deleteBtnLists.textContent = "Supprimer";
                deleteBtnLists.classList.add("deleteProfilList");

                for (const key in object) {
                    const value = object[key];
                    const item = document.createElement("li");

                    if (key === "type") {
                        titleH3.innerText = `${object.type} - ${object.title}`;
                    }
                    if (["status", "id", "userId", "type", "title"].includes(`${key}`)) {
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
                    profilList.appendChild(deleteBtnLists);
                    listWrapper.append(profilList);
                }

                deleteBtnLists.addEventListener("click", function(e){
                    e.preventDefault();
                    const btnId = parseInt(e.target.value);

                    if (btnId !== object.id) {
                        console.warn("pas touche");
                        return;
                    } else if (confirm('Voulez-vous vraiment vous supprimer la liste ?') === true) {
                        fetchDeleteList(object.id)
                        .then(() => {
                            dialog({title: "Suppression de la liste",
                            content: `<p>Votre liste a bien été supprimée.</p>`
                            });
                            redirect('http://localhost/listerr/src/app/src/list/pages/lists.html', 2000);
                        });
                    }
                })

                contentList.addEventListener("click", function(){
                    console.log({type: object.type, userId: object.user.id, localStorage: JSON.parse(localStorage.getItem("user")).id});
                    if (object.type === "TodoList" && object.user.id !== JSON.parse(localStorage.getItem("user")).id) {
                        return false;
                    }
                    redirect(`http://localhost/listerr/src/app/src/list/pages/list.html?id=${object.id}`, 0);
                })
            }
        }
    })
}

document.addEventListener("DOMContentLoaded", () => {
    const createListForm = document.querySelector("#createListForm");
    CSRFToken(createListForm.id);
    lists();
});
