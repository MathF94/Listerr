"use strict";

import { fetchRead } from "./actions.js";
import { redirect, uploadElement } from "../../services/utils.js";

function read(div) {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const deleteBtn = document.querySelector("#delete");
    const updateBtn = document.querySelector("#update");

    if (token === null || user === null) {
        fetchRead()
        .then(response => {
            if (response.status === "disconnected") {
                deleteBtn.classList.add("hide");
                updateBtn.classList.add("hide");
            }
        })
    }

    if (token !== undefined || token !== null || user !== null || user !== undefined) {
        fetchRead()
        .then(response => {
            if (response.status === "connected" && token !== null && user !== null) {
                div.replaceChildren();
                deleteBtn.classList.remove("hide");
                updateBtn.classList.remove("hide");
                const ul = document.createElement("ul");

                for (const index in response) {
                    const li = document.createElement("li");
                    const column = response[index];

                    if (["status", "id"].includes(index)) {
                        continue;
                    }

                    li.innerText = `${column.label} : ${column.value}`;
                    ul.appendChild(li);
                }
                div.prepend(ul);

                updateBtn.addEventListener("click", function(e){
                    redirect("#/update.html", 0);
                });
            };
        });
    };
}

function getAnchor() {
    uploadElement('#profilWrapperContent')
    .then(form => {
        read(form);
    })
}

document.addEventListener('DOMSubtreeModified', getAnchor());

export { read };
