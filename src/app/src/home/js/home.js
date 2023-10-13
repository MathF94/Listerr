"use strict"

// redirection vers la page Listes pour la création de liste
// affichage de toutes les listes des utilisateurs == profils.js mais pour les listes

import { fetchAllLists } from "./actions_home.js";
import { dialog, redirect } from "../../services/utils.js";

function readAllLists() {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const listBtn = document.querySelector("#newList");

    if (token === undefined || token === null || user === null || user === undefined) {
        listBtn.addEventListener("click", function(e){
            dialog({title:"Vous n'êtes pas encore connecté ?", content: "Vous allez être redirigé(e) vers la page de connexion", hasTimeOut: true})
            redirect("http://localhost/listerr/src/app/src/user/pages/login.html");
        });
    }

    if (user !== undefined && user !== null) {
        listBtn.addEventListener("click", function(e){
            redirect("http://localhost/listerr/src/app/src/list/pages/list.html", 0);
        });
    }

    fetchAllLists()
    .then(response => {
        const data = response.data;
        if (response.status === "read"){
            const list = document.querySelector('#AllListWrapper');

            for (const index in data) {
                const column = data[index]
                const div = document.createElement("div");
                div.classList.add("list");
                const ul = document.createElement("ul");

                const h3 = document.createElement("h3");
                for (const key in column){
                    const li = document.createElement("li");

                    if (["status", "id", "userId"].includes(`${key}`)) {
                        continue;
                    }
                    li.innerText = `${column[key]}`;
                    ul.appendChild(li);
                    div.appendChild(h3);
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