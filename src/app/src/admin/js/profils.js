"use strict";

import {
    fetchReadAll,
    fetchUpdateUser,
    fetchDeleteUser
} from "../../actions/actions_admin.js";

import { displayFormUpdateUser } from "../../admin/js/form_user.js"

import { CSRFToken } from "../../services/CSRFToken.js";

import {
    configPath,
    redirect,
    notAllowedRedirection,
    dialog,
    scroll
} from "../../services/utils.js";

notAllowedRedirection();
/**
 * Récupère et affiche la liste des utilisateurs (à l'exception de l'utilisateur avec le rôle "Admin") depuis l'API.
 */

function readAdmin() {
    fetchReadAll().then((response) => {
        if (response.status === "ReadAllUsers") {
            const mainSection = document.querySelector("#mainSection");

            const popIn = document.createElement("div");
            popIn.id = "popIn";
            popIn.classList.add("popIn");

            mainSection.appendChild(popIn)

            const data = response.data;
            const table = document.querySelector("table");
            const tbody = document.querySelector("tbody");
            table.classList.add("userList");

            const listUser = document.querySelector("#newUser");
            listUser.title ="Créer un nouvel utilisateur";

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
                // if (["id"].includes(column) || column.role === "Admin") {
                //     continue;
                // }

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

                const tdBtn = document.createElement("td");
                tdBtn.classList.add("profil_read");
                tdBtn.classList.add("edit");
                tdBtn.classList.add("delete");

                const readBtn = document.createElement("button");
                readBtn.id = `readUserProfil-${column.id}`;
                readBtn.type = "button";
                readBtn.title = "Affiche le profil d'un utilisateur et ses listes";
                readBtn.textContent = "";
                readBtn.value = column.id;
                readBtn.classList.add("btn");
                readBtn.classList.add("view");
                readBtn.classList.add("admin");

                const editBtn = document.createElement("button");
                editBtn.id = `editUserProfil-${column.id}`;
                editBtn.type = "button";
                editBtn.title = "Modifier le profil d'un utilisateur";
                editBtn.textContent = "";
                editBtn.value = column.id;
                editBtn.classList.add("btn");
                editBtn.classList.add("valid");
                editBtn.classList.add("edit");
                editBtn.classList.add("admin");

                const deleteBtn = document.createElement("button");
                deleteBtn.id = `deleteUserProfil-${column.id}`;
                deleteBtn.type = "button";
                deleteBtn.title = "Supprimer le profil d'un utilisateur";
                deleteBtn.textContent = "";
                deleteBtn.value = column.id;
                deleteBtn.classList.add("btn");
                deleteBtn.classList.add("delete");
                deleteBtn.classList.add("admin");

                // dropDownMenu(tdBtn);
                tdBtn.appendChild(readBtn);
                tdBtn.appendChild(editBtn);
                tdBtn.appendChild(deleteBtn);
                tr.appendChild(tdBtn);

                readBtn.addEventListener("click", function (e) {
                    e.preventDefault();
                    redirect(
                        `${configPath.basePath}/user/pages/profil.html?id=${column.id}`,
                        0
                    );
                });

                /**
                // En tant qu'Admin, permet la modification d'un utilisateur via la liste d'utilisateur
                 */
                editBtn.addEventListener("click", function (e) {
                    e.preventDefault();
                    if (parseInt(e.target.value) !== column.id) {
                        return;
                    }

                    const updateProfilsDiv = document.createElement("div");
                    updateProfilsDiv.id = "updateProfilsDiv";
                    popIn.appendChild(updateProfilsDiv);

                    // Affichage du formulaire d'édition du profil
                    displayFormUpdateUser(updateProfilsDiv);
                    popIn.style.visibility = "visible";

                    titleFormUser.innerText = "Formulaire d'édition de l'utilisateur";

                    // Affichage de la liste d'utilisateur + suppression du formulaire d'édition
                    cancelForm.addEventListener("click", function(){
                        updateProfilsDiv.remove();
                        popIn.style.visibility = "hidden";
                    })

                    // Insertion des éléments de la liste dans les inputs
                    if (column.role === "User") {
                        const selectType = document.querySelector("#role");
                        selectType.value = 0;
                        const optionUser = document.querySelector("#roleUser");
                        optionUser.setAttribute("value", "User");
                        optionUser.selected = true
                    }

                    const inputId = document.querySelector("#id");
                    inputId.value = column.id;
                    const inputLogin = document.querySelector("#login");
                    inputLogin.value = column.login;
                    const inputName = document.querySelector("#name");
                    inputName.value = column.name;
                    const inputFirstame = document.querySelector("#firstname");
                    inputFirstame.value = column.firstname;
                    const inputEmail = document.querySelector("#email");
                    inputEmail.value = column.email;
                    const selectType = document.querySelector("#role");

                    CSRFToken(formUpdateUser.attributes.id.value);
                    formUpdateUser.addEventListener("submit", function(e) {
                        e.preventDefault();
                        inputLogin.addEventListener("invalid", function(e) {
                            validate(e.target)
                        })
                        inputName.addEventListener("invalid", function(e) {
                            validate(e.target)
                        })
                        inputFirstame.addEventListener("invalid", function(e) {
                            validate(e.target)
                        })
                        inputEmail.addEventListener("invalid", function(e) {
                            validate(e.target)
                        })
                        selectType.addEventListener("invalid", function(e) {
                            validate(e.target)
                        })

                        scroll();
                        fetchUpdateUser(formUpdateUser, column.id)
                        .then(response => {
                            localStorage.removeItem("csrfToken");
                            if (response.status === "[Admin]updateUser") {
                                dialog({title: "Modification du profil par l'Admin", content: `Le profil de ${column.firstname} ${column.name} a bien été mise à jour.`});
                                const dialogMsg = document.querySelector("dialog");
                                dialogMsg.classList.add("valid");
                                redirect(`${configPath.basePath}/admin/pages/profils.html`);
                            };

                            if (response.status === "errors") {
                                dialog({title: "Erreurs", content: response.errors});
                                const dialogMsg = document.querySelector("dialog");
                                dialogMsg.classList.add("errors");
                                redirect(`${configPath.basePath}/admin/pages/profils.html`);
                            };
                        })
                    })
                });

                // En tant qu'Admin, permet la suppression d'un utilisateur via la liste d'utilisateur
                deleteBtn.addEventListener("click", function (e) {
                    e.preventDefault();
                    if (parseInt(e.target.value) !== column.id) {
                        return;
                    }

                    if (confirm(`Voulez-vous vraiment vous supprimer le compte de l'utilisateur ${column.firstname} ${column.name} ?`) === true) {
                        fetchDeleteUser(column.id)
                        .then(() => {
                            dialog({title: "Suppression de compte",
                                    content: `<p>Le compte de ${column.firstname} ${column.name} a bien été supprimé.</p>`});
                            redirect(`${configPath.basePath}/admin/pages/profils.html`);
                        })
                    }
                });

                tbody.appendChild(tr);
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    readAdmin();
});
