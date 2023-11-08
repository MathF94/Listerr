"use strict";

import {
    fetchCreateList,
    fetchReadAllLists,
    fetchDeleteList
} from "../../actions/actions_lists.js";
import { CSRFToken } from "../../services/CSRFToken.js";
import {
    configPath,
    redirect,
    dialog,
    notAllowedRedirection
} from "../../services/utils.js";

notAllowedRedirection();

/**
 * Fonction principale pour gérer la page des listes.
 */
function lists() {
    const createListBtn = document.querySelector("#listCreater");
    const validListBtn = document.querySelector("#validForm");
    const cancelListBtn = document.querySelector("#cancelForm");
    validListBtn.disabled = true;
    cancelListBtn.disabled = true;
    const listForm = document.querySelector("#listForm");
    const cancelForm = document.querySelector("#cancelForm");

    // Affiche le formulaire de création de liste lorsqu'on clique sur le bouton "Nouvelle liste".
    createListBtn.addEventListener("click", function(){
        if (createListBtn.value === "newList") {
            listForm.classList.remove("hidden");
            validListBtn.disabled = false;
            cancelListBtn.disabled = false;
        }
    })
    // Masque le formulaire de création de liste lorsqu'on clique sur le bouton "Annuler".
    cancelForm.addEventListener("click", function(){
        listForm.classList.add("hidden");
        validListBtn.disabled = true;
        cancelListBtn.disabled = true;
    })

    // Gère la soumission du formulaire de création de liste.
    createListForm.addEventListener("submit", function(e){
        e.preventDefault();

        fetchCreateList(createListForm)
        .then(response => {
            localStorage.removeItem("csrfToken");

            if (response.status === "success") {
                dialog({title: "Et une liste de créée, une !", content:"aux cartes maintenant !"});
                redirect(`${configPath.basePath}/list/pages/lists.html`);

            }
            if (response.status === "fail") {
                dialog({title: "Erreurs", content: response.errors, hasTimeOut: true});
                redirect(`${configPath.basePath}/list/pages/lists.html`);
            };
        })
    })

    // Récupère et affiche la liste des listes existantes.
    fetchReadAllLists()
    .then(response => {

        const data = response.data;
        if (response.status === "read"){
            const listWrapper = document.querySelector('#listsWrapper');

            for (const index in data) {
                const objectList = data[index]
                const profilList = document.createElement("div");
                profilList.id = `profilList-${objectList.id}`;
                profilList.classList.add("profilList");

                const contentList = document.createElement("div");
                contentList.id = `contentList-${objectList.id}`;
                contentList.classList.add("contentList");

                const titleH3 = document.createElement("h3");
                const list = document.createElement("ul");

                const deleteBtnLists = document.createElement("button");
                deleteBtnLists.id = `deleteProfilList-${objectList.id}`;
                deleteBtnLists.name = "deleteProfilList";
                deleteBtnLists.type = "submit";
                deleteBtnLists.value = `${objectList.id}`;
                deleteBtnLists.textContent = "Supprimer";
                deleteBtnLists.classList.add("deleteProfilList");

                for (const key in objectList) {
                    const value = objectList[key];
                    const item = document.createElement("li");

                    if (key === "type") {
                        titleH3.innerText = `${objectList.type} - ${objectList.title}`;
                    }
                    if (["status", "id", "userId", "type", "title", "cards"].includes(`${key}`)) {
                        continue;
                    }
                    if (key === "user" && typeof(value) === "object") {
                        item.innerText = `Par ${objectList[key].login}.`;
                    }
                    else {
                        if (key === "createdAt") {
                            item.innerText = `Créée le ${objectList[key]}`;
                        } else if (key === "updatedAt")  {
                            item.innerText = `Modifiée le ${objectList[key]}`;
                        } else {
                            item.innerText = `${objectList[key]}`;
                        }
                    }

                    contentList.appendChild(titleH3);
                    list.appendChild(item);
                    contentList.appendChild(list);
                    profilList.appendChild(contentList);
                    profilList.appendChild(deleteBtnLists);
                    listWrapper.append(profilList);
                }

                // Gestion de la suppression de liste
                deleteBtnLists.addEventListener("click", function(e){
                    e.preventDefault();
                    const btnListId = parseInt(e.target.value);

                    if (btnListId !== objectList.id) {
                        console.warn("pas touche");
                        return;
                    } else if (confirm('Voulez-vous vraiment vous supprimer la liste ?') === true) {
                        fetchDeleteList(objectList.id)
                        .then(() => {
                            dialog({title: "Suppression de la liste",
                            content: `<p>Votre liste a bien été supprimée.</p>`
                            });
                            redirect(`${configPath.basePath}/list/pages/lists.html`);
                        });
                    }
                })

                // Redirige vers la page de détails de la liste en cliquant sur la liste.
                contentList.addEventListener("click", function(){
                    console.log({type: objectList.type, userId: objectList.user.id, localStorage: JSON.parse(localStorage.getItem("user")).id});
                    if (objectList.type === "TodoList" && objectList.user.id !== JSON.parse(localStorage.getItem("user")).id) {
                        return false;
                    }
                    redirect(`${configPath.basePath}/list/pages/list.html?id=${objectList.id}`, 0);
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
