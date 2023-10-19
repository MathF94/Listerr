"use strict";

import { fetchCreateList, fetchReadAllList, fetchDeleteList } from "./actions.js";
import { redirect, dialog } from "../../services/utils.js";

function list() {
    const form = document.querySelector("form");
    form.addEventListener("submit", function(e){
        e.preventDefault();

        fetchCreateList(form)
        .then(response => {
            if (response.status === "success") {
                dialog({title: "Et une liste de créée, une !", content:"aux cartes maintenant !"});
                redirect("http://localhost/listerr/src/app/src/list/pages/list.html");

            }
            if (response.status === "fail") {
                dialog({title: "Erreurs", content: response.errors, hasTimeOut: true});
                redirect("http://localhost/listerr/src/app/src/list/pages/list.html");
            };
        })
    })

    fetchReadAllList()
    .then(response => {
        const data = response.data;
        if (response.status === "read"){
            const list = document.querySelector('#listWrapper');

            for (const index in data) {
                const object = data[index]
                const div = document.createElement("div");
                div.id = "profilList";
                div.classList.add("list");

                const ul = document.createElement("ul");
                const h3 = document.createElement("h3");

                const formDelete = document.createElement("form");
                formDelete.id = "deleteForm";
                formDelete.action = "?route=delete_list";
                formDelete.method = "post";

                const deleteBtn = document.createElement("button");
                deleteBtn.id = "deleteProfilList";
                deleteBtn.type = "submit";
                deleteBtn.textContent = "Supprimer";
                deleteBtn.value = `${object.id}`;
                deleteBtn.classList.add("deleteProfilList");

                for (const key in object){
                    const value = object[key];
                    const li = document.createElement("li");

                    if (key === "type") {
                        h3.innerText = object.type;
                    }
                    if (key === "user" && typeof(value) === "object") {
                        li.innerText = `Créée par ${object[key].login}, le ${object.createdAt}. Dernière modification : ${object.updatedAt}.`;
                    }
                    else {
                        li.innerText = `${object[key]}.`;
                    }
                    if (["status", "id", "userId", "type", "createdAt", "updatedAt"].includes(`${key}`)) {
                        continue;
                    }

                    div.appendChild(h3);
                    ul.appendChild(li);
                    div.appendChild(ul);
                    div.appendChild(formDelete);
                    formDelete.appendChild(deleteBtn);
                    list.append(div);
                }

                formDelete.addEventListener("submit", function(e){
                    e.preventDefault();

                    if (e.submitter.value !== deleteBtn.value) {
                        console.log("pas touche");
                        return;
                    } else if (confirm('Voulez-vous vraiment vous supprimer la liste ?') === true) {
                        fetchDeleteList()
                        .then(response => {
                            dialog({title: "Suppression de la liste",
                            content: `<p>Votre liste a bien été supprimée.</p>`,

                            });
                            redirect('http://localhost/listerr/src/app/src/list/pages/list.html', 2000);
                        });
                    }
                })
            }
        }
    })
}

document.addEventListener("DOMContentLoaded", () => {
    list();
});
