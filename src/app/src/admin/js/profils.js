"use strict";

import { fetchReadAll } from "../../actions/actions_admin.js";
import { configPath, redirect, notAllowedRedirection, dialog } from "../../services/utils.js";

notAllowedRedirection();
/**
 * Récupère et affiche la liste des utilisateurs (à l'exception des utilisateurs avec le rôle "Admin") depuis l'API.
 */
function readAdmin() {

    fetchReadAll()
    .then(response => {
        const data = response.data;
        const tbody = document.querySelector("tbody");
        const listUser = document.querySelector("#newUser");

        listUser.addEventListener("click", function(e){
            redirect(`${configPath.basePath}/user/pages/registration.html`, 0);
        });

        for (const index in data) {
            const column = data[index];

            // Exclut les colonnes inutiles ou les utilisateurs avec le rôle "Admin"
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
            readBtn.title = "Lire : amène vers le profil d'un utilisateur et ses listes";
            readBtn.id = `readUserProfil-${column.id}`;
            readBtn.value = column.id;

            tdReadBtn.appendChild(readBtn);
            tr.appendChild(tdReadBtn);

            const tdEditBtn = document.createElement("td");
            const editBtn = document.createElement("button");
            editBtn.textContent = "Modifier";
            editBtn.title = "Modifier : permet de modifier le profil d'un utilisateur";
            editBtn.id = `editUserProfil-${column.id}`;
            editBtn.value = column.id;
            tdEditBtn.appendChild(editBtn);
            tr.appendChild(tdEditBtn);

            const tdDeleteBtn = document.createElement("td");
            const deleteForm = document.createElement("form");
            deleteForm.action = "?route=admin_delete_user";
            deleteForm.method = "post";

            const deleteBtn = document.createElement("button");
            deleteBtn.title = "Supprimer : permet de supprimer le profil d'un utilisateur";
            deleteBtn.value = column.id;
            deleteBtn.id = `deleteUserProfil-${column.id}`;
            deleteBtn.type = "submit";
            deleteBtn.textContent = "Supprimer";
            deleteForm.appendChild(deleteBtn);
            tdDeleteBtn.appendChild(deleteForm);
            tr.appendChild(tdDeleteBtn);

            readBtn.addEventListener("click", function(e){
                e.preventDefault();
                redirect(`${configPath.basePath}/user/pages/profil.html?id=${column.id}`, 0);
            })

            editBtn.addEventListener("click", function(e){
                e.preventDefault();
                dialog({title: "Prévue pour la version 2.0", content: "Merci de votre compréhension."});
                redirect(`${configPath.basePath}/admin/pages/profils.html`)
            })

            deleteBtn.addEventListener("click", function(e){
                e.preventDefault();
                dialog({title: "Prévue pour la version 2.0", content: "Merci de votre compréhension."});
                redirect(`${configPath.basePath}/admin/pages/profils.html`)
            })

            tbody.appendChild(tr);
        };
    });
}

document.addEventListener("DOMContentLoaded", () => {
    readAdmin();
});