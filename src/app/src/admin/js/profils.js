"use strict";

import { fetchReadAll } from "../../actions/actions_admin.js";
import { configPath, redirect, notAllowedRedirection, dialog } from "../../services/utils.js";

notAllowedRedirection();
/**
 * Récupère et affiche la liste des utilisateurs (à l'exception de l'utilisateur avec le rôle "Admin") depuis l'API.
 */
function readAdmin() {

    fetchReadAll()
    .then(response => {
        if(response.status === "ReadAllUsers"){
            const data = response.data;
            const tbody = document.querySelector("tbody");
            const table = document.querySelector("table");
            table.classList.add("userList");
            const listUser = document.querySelector("#newUser");

            // Bouton de redirection pour création d'utilisateur
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
                readBtn.textContent = "";
                readBtn.title = "Amène vers le profil d'un utilisateur et ses listes";
                readBtn.id = `readUserProfil-${column.id}`;
                readBtn.value = column.id;
                readBtn.classList.add("btn");
                readBtn.classList.add("view");

                tdReadBtn.appendChild(readBtn);
                tr.appendChild(tdReadBtn);

                const tdEditBtn = document.createElement("td");
                const editBtn = document.createElement("button");
                editBtn.textContent = "";
                editBtn.title = "Modifier le profil d'un utilisateur";
                editBtn.id = `editUserProfil-${column.id}`;
                editBtn.value = column.id;
                editBtn.classList.add("btn");
                editBtn.classList.add("valid");
                editBtn.classList.add("edit");
                tdEditBtn.appendChild(editBtn);
                tr.appendChild(tdEditBtn);

                const tdDeleteBtn = document.createElement("td");
                const deleteForm = document.createElement("form");
                deleteForm.action = "?route=admin_delete_user";
                deleteForm.method = "post";

                const deleteBtn = document.createElement("button");
                deleteBtn.title = "Supprimer le profil d'un utilisateur";
                deleteBtn.value = column.id;
                deleteBtn.classList.add("btn");
                deleteBtn.classList.add("delete");
                deleteBtn.id = `deleteUserProfil-${column.id}`;
                deleteBtn.type = "submit";
                deleteBtn.textContent = "";
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

        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    readAdmin();
});