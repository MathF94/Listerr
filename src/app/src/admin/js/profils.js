"use strict";

import { fetchReadAll } from "../../actions/actions_admin.js";
import {
    configPath,
    redirect,
    notAllowedRedirection,
    dialog,
} from "../../services/utils.js";

notAllowedRedirection();
/**
 * Récupère et affiche la liste des utilisateurs (à l'exception de l'utilisateur avec le rôle "Admin") depuis l'API.
 */
function readAdmin() {
    fetchReadAll().then((response) => {
        if (response.status === "ReadAllUsers") {
            const data = response.data;
            const tbody = document.querySelector("tbody");
            const table = document.querySelector("table");
            table.classList.add("userList");
            const listUser = document.querySelector("#newUser");

            // Bouton de redirection pour création d'utilisateur
            listUser.addEventListener("click", function (e) {
                redirect(
                    `${configPath.basePath}/user/pages/registration.html`,
                    0
                );
            });

            for (const index in data) {
                const column = data[index];

                // Exclut les colonnes inutiles ou les utilisateurs avec le rôle "Admin"
                if (["id"].includes(column) || column.role === "Admin") {
                    continue;
                }

                const tr = document.createElement("tr");

                const tdLogin = document.createElement("td");
                tdLogin.classList.add("profil_login");
                tdLogin.innerHTML = `${column["login"]}`;
                tr.appendChild(tdLogin);

                const tdName = document.createElement("td");
                tdName.classList.add("profil_name");
                tdName.innerHTML = `${column["name"]}`;
                tr.appendChild(tdName);

                const tdFirstname = document.createElement("td");
                tdFirstname.classList.add("profil_firstname");
                tdFirstname.innerHTML = `${column["firstname"]}`;
                tr.appendChild(tdFirstname);

                const tdEmail = document.createElement("td");
                tdEmail.classList.add("profil_email");
                tdEmail.innerHTML = `${column["email"]}`;
                tr.appendChild(tdEmail);

                const tdRole = document.createElement("td");
                tdRole.classList.add("profil_role");
                tdRole.innerHTML = `${column["role"]}`;
                tr.appendChild(tdRole);

                const tdReadBtn = document.createElement("td");
                tdReadBtn.classList.add("profil_read");
                const readBtn = document.createElement("button");
                readBtn.id = `readUserProfil-${column.id}`;
                readBtn.type = "button";
                readBtn.title =
                    "Amène vers le profil d'un utilisateur et ses listes";
                readBtn.textContent = "";
                readBtn.value = column.id;
                readBtn.classList.add("btn");
                readBtn.classList.add("view");

                tdReadBtn.appendChild(readBtn);
                tr.appendChild(tdReadBtn);

                const tdEditBtn = document.createElement("td");
                tdEditBtn.classList.add("profil_edit");
                const editBtn = document.createElement("button");
                editBtn.textContent = "";
                editBtn.title = "Modifier le profil d'un utilisateur";
                editBtn.id = `editUserProfil-${column.id}`;
                editBtn.value = column.id;
                editBtn.type = "button";
                editBtn.classList.add("btn");
                editBtn.classList.add("valid");
                editBtn.classList.add("edit");
                tdEditBtn.appendChild(editBtn);
                tr.appendChild(tdEditBtn);

                const tdDeleteBtn = document.createElement("td");
                tdDeleteBtn.classList.add("profil_delete");
                const deleteBtn = document.createElement("button");
                deleteBtn.title = "Supprimer le profil d'un utilisateur";
                deleteBtn.value = column.id;
                deleteBtn.classList.add("btn");
                deleteBtn.classList.add("delete");
                deleteBtn.id = `deleteUserProfil-${column.id}`;
                deleteBtn.type = "click";
                deleteBtn.textContent = "";
                tdDeleteBtn.appendChild(deleteBtn);
                tr.appendChild(tdDeleteBtn);

                readBtn.addEventListener("click", function (e) {
                    e.preventDefault();
                    redirect(
                        `${configPath.basePath}/user/pages/profil.html?id=${column.id}`,
                        0
                    );
                });

                editBtn.addEventListener("click", function (e) {
                    e.preventDefault();
                    dialog({
                        title: "Prévue pour la version 2.0",
                        content: "Merci de votre compréhension.",
                    });
                    redirect(`${configPath.basePath}/admin/pages/profils.html`);
                });

                deleteBtn.addEventListener("click", function (e) {
                    e.preventDefault();
                    dialog({
                        title: "Prévue pour la version 2.0",
                        content: "Merci de votre compréhension.",
                    });
                    redirect(`${configPath.basePath}/admin/pages/profils.html`);
                });

                tbody.appendChild(tr);
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    readAdmin();
});
