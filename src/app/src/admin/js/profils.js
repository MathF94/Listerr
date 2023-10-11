"use strict";

import { fetchReadAll } from "./actions.js";
import { uploadElement } from "../../services/utils.js";

function readAdmin(table) {

    fetchReadAll()
    .then(response => {
        const tbody = table.tBodies[0];
        tbody.replaceChildren();
        console.log({tbody});
        const data = response.data;
        console.log({data});

        for (const index in data) {

            const column = data[index];
            if (["id"].includes(column[index])) {
                continue;
            };

            const tr = document.createElement("tr");
            const tdLogin = document.createElement("td");
            tdLogin.innerHTML = `${column["login"]}`;
            tr.appendChild(tdLogin);

            const tdName = document.createElement("td");
            tdName.innerHTML = `${column["name"]}`;
            tr.appendChild(tdName);

            const tdFirstname = document.createElement("td");
            tdFirstname.innerHTML = `${column["firstname"]}`;
            tr.appendChild(tdFirstname);

            const tdEmail = document.createElement("td");
            tdEmail.innerHTML = `${column["email"]}`;
            tr.appendChild(tdEmail);

            const tdRole = document.createElement("td");
            tdRole.innerHTML = `${column["role"]}`;
            tr.appendChild(tdRole);

            const tdReadBtn = document.createElement("td");
            const readBtn = document.createElement("button");
            readBtn.textContent = "Lire";
            tdReadBtn.appendChild(readBtn);
            tr.appendChild(tdReadBtn);

            const tdEditBtn = document.createElement("td");
            const editBtn = document.createElement("button");
            editBtn.textContent = "Modifier";
            tdEditBtn.appendChild(editBtn);
            tr.appendChild(tdEditBtn);

            const tdDeleteBtn = document.createElement("td");
            const deleteForm = document.createElement("form");
            const deleteBtn = document.createElement("button");
            deleteBtn.type = "submit";
            deleteBtn.value = "delete";
            deleteBtn.textContent = "Supprimer";
            deleteForm.appendChild(deleteBtn);
            tdDeleteBtn.appendChild(deleteForm);
            tr.appendChild(tdDeleteBtn);

            tbody.appendChild(tr);
        };
    });
}

function getTable() {
    uploadElement('#profilsTable')
    .then(table => {
        readAdmin(table);
    })
}
    
document.addEventListener('DOMSubtreeModified', getTable());

export { readAdmin };