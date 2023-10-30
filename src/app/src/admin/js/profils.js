"use strict";

import { fetchReadAll } from "../../actions/actions_admin.js";

function readAdmin() {

    fetchReadAll()
    .then(response => {
        const data = response.data;
        const tbody = document.querySelector("tbody");

        for (const index in data) {
            const column = data[index];
            if (["id"].includes(column) || column.role === "Admin") {
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
            readBtn.title = "Lire : amène vers le profil d'un utilisateur et ses listes"
            tdReadBtn.appendChild(readBtn);
            tr.appendChild(tdReadBtn);

            const tdEditBtn = document.createElement("td");
            const editBtn = document.createElement("button");
            editBtn.textContent = "Modifier";
            editBtn.title = "Modifier : permet de modifier le profil d'un utilisateur"
            tdEditBtn.appendChild(editBtn);
            tr.appendChild(tdEditBtn);

            const tdDeleteBtn = document.createElement("td");
            const deleteForm = document.createElement("form");
            deleteForm.action = "?route=admin_delete_user";
            deleteForm.method = "post";
            const deleteBtn = document.createElement("button");
            deleteBtn.title = "Supprimer : permet de supprimer le profil d'un utilisateur"
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

document.addEventListener("DOMContentLoaded", () => {
    readAdmin();
});