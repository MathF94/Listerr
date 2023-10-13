"use strict";

import { fetchCreateList, fetchReadList } from "./actions";
import { redirect, dialog } from "../../services/utils";

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

    fetchReadList()
    .then(response => {
        const user = localStorage.getItem("user");
        const data = response.data;
        console.log(data);
        if (response.status === "read"){
            const list = document.querySelector('#listWrapper');

            for (const index in data) {
                const column = data[index]
                const div = document.createElement("div");
                div.classList.add("list");
                const ul = document.createElement("ul");

                for (const key in column){
                    const li = document.createElement("li");

                    if (["status", "id", "userId"].includes(`${key}`)) {
                        continue;
                    }

                    li.innerText = `${column[key]}`;
                    ul.appendChild(li);
                    div.appendChild(ul);
                    list.append(div);
                }
            }
        }
    })
}

document.addEventListener("DOMContentLoaded", () => {
    list();
});
