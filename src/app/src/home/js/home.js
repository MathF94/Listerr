"use strict"

// redirection vers la page Listes pour la création de liste
// affichage de toutes les listes des utilisateurs == profils.js mais pour les listes

import { fetchAllListsByUser } from "./actions_home.js";
import { dialog, redirect } from "../../services/utils.js";

function readAllLists() {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const listBtn = document.querySelector("#newList");

    if (token === undefined || token === null || user === null || user === undefined) {
        listBtn.addEventListener("click", function(e) {
            dialog({title:"Vous n'êtes pas encore connecté ?", content: "Vous allez être redirigé(e) vers la page de connexion", hasTimeOut: true})
            redirect("http://localhost/listerr/src/app/src/user/pages/login.html");
        });
        return;
    }

    if (user !== undefined && user !== null) {
        listBtn.addEventListener("click", function(e){
            redirect("http://localhost/listerr/src/app/src/list/pages/list.html", 0);
        });
    }


    fetchAllListsByUser()
    .then(response => {
        const data = response.data;
        if (response.status === "read"){
            const list = document.querySelector('#AllListWrapper');

            for (const index in data) {
                const object = data[index]
                const div = document.createElement("div");
                div.id = "homeList";
                div.classList.add("list");
                const ul = document.createElement("ul");
                const h3 = document.createElement("h3");

                for (const key in object) {
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
                    list.append(div);
                }
            }
        }
    })
}

document.addEventListener("DOMContentLoaded", () => {
    readAllLists();
});