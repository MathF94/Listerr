"use strict";

import { fetchRead } from "./actions.js";
import { redirect } from "../../services/utils.js";

function read() {

    fetchRead()
    .then(response => {
        const deleteBtn = document.querySelector("#delete");
        const updateBtn = document.querySelector("#update");
        const listBtn = document.querySelector("#listsUser");

        if (response.status === "disconnected") {
            deleteBtn.classList.add("hide");
            updateBtn.classList.add("hide");
        }
        
        if (response.status === "connected" && localStorage.token && localStorage.user) {
            deleteBtn.classList.remove("hide");
            updateBtn.classList.remove("hide");
            const profilWrapper = document.querySelector("#profilWrapper");
            const list = document.createElement("ul");

            for (const index in response) {
                const item = document.createElement("li");
                const column = response[index];

                if (["status", "id"].includes(index)) {
                    continue;
                }

                item.innerText = `${column.label} : ${column.value}`;
                list.appendChild(item);
            }
            profilWrapper.prepend(list);

            listBtn.addEventListener("click", function(e){
                redirect("http://localhost/listerr/src/app/src/list/pages/lists.html", 0);
            });
            updateBtn.addEventListener("click", function(e){
                redirect("http://localhost/listerr/src/app/src/user/pages/update.html", 0);
            });
        };
    });
};

document.addEventListener("DOMContentLoaded", () => {
    read();
});
