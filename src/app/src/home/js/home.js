"use strict"

// redirection vers la page Listes pour la création de liste
// affichage de toutes les listes des utilisateurs == profils.js mais pour les listes

import { fetchAllListsByUsers } from "./actions_home.js";
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


    fetchAllListsByUsers()
    .then(response => {
        const data = response.data;
        if (response.status === "read"){
            const AllListWrapper = document.querySelector('#AllListWrapper');

            for (const index in data) {
                const object = data[index]
                const content = document.createElement("div");
                content.id = "homeList";
                content.classList.add("homeList");
                const list = document.createElement("ul");
                const titleH3 = document.createElement("h3");

                for (const key in object) {
                    const value = object[key];
                    const item = document.createElement("li");

                    if (key === "type") {
                        titleH3.innerText = object.type
                    }
                    if (["status", "id", "userId", "type"].includes(`${key}`)) {
                        continue;
                    }

                    if (key === "user" && typeof(value) === "object") {
                        item.innerText = `Par ${object[key].login}`;
                    } else {
                        if (key === "createdAt") {
                            item.innerText = `Créée le ${object[key]}`;
                        } else if (key === "updatedAt")  {
                            item.innerText = `Modifiée le ${object[key]}`;
                        } else {
                            item.innerText = `${object[key]}`;
                        }
                    }

                    list.appendChild(item);
                    content.appendChild(titleH3);
                    content.appendChild(list);
                    AllListWrapper.append(content);
                }
                content.addEventListener("click", function(){
                    if (object.type === "WishList") {
                        redirect(`http://localhost/listerr/src/app/src/list/pages/list.html?id=${object.id}`, 0);
                        }
                })
            }
        }
    })
}

document.addEventListener("DOMContentLoaded", () => {
    readAllLists();
});