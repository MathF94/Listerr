"use strict";

import {
    fetchDeleteUser,
    fetchUpdateUser
} from "../../actions/actions_admin.js";

import { fetchReadAllLists } from "../../actions/actions_lists.js";

import { fetchRead } from "../../actions/actions_user.js";

import { displayFormUpdateUser } from "../../admin/js/form_user.js";

import { dropDownMenu } from "../../layout/dropdown.js";

import { CSRFToken } from "../../services/CSRFToken.js";

import {
    allowedIds,
    configPath,
    type,
    dialog,
    redirect,
    notAllowedRedirection,
} from "../../services/utils.js";

notAllowedRedirection();

/**
 * Gère l'affichage des informations de profil de l'utilisateur et les fonctionnalités associées.
 *      l'affichage des informations d'un profil utilisateur par l'admin
 */
function read() {
    // Appelle la fonction fetchRead pour obtenir les informations du profil de l'utilisateur.
    const listWrapper = document.querySelector("#listsWrapper");
    const profilWrapper = document.querySelector("#profilWrapper");

    const updateBtn = document.querySelector("#update");
    updateBtn.title = "Modifier le profil";
    updateBtn.classList.add("listBtn");

    const deleteBtn = document.querySelector("#delete");
    deleteBtn.title = "Supprimer le profil";
    deleteBtn.classList.add("listBtn");

    const listBtn = document.querySelector("#listsUser");
    listBtn.title ="Accéder à mes listes";

    const popIn = document.createElement("div");
    popIn.id = "popIn";
    popIn.classList.add("popIn");

    profilWrapper.appendChild(popIn);

    const urlParams = new URLSearchParams(document.location.search);

    function displayUser(response) {
        const list = document.createElement("ul");
        const role = JSON.parse(localStorage.user).role

        for (const index in response) {
            const item = document.createElement("li");
            const column = response[index];

            if (role === "Admin") {
                if (["status", "id"].includes(index)) {
                    continue;
                }
            }
            if (role === "User") {
                if (["status", "id", "role"].includes(index)) {
                    continue;
                }
            }
            item.innerText = `${column.label} : ${column.value}`;
            list.appendChild(item);
        }
        profilWrapper.prepend(list);
    }

    // Affichage d'un utilisateur vu par l'admin
    if (urlParams.has("id")) {
        // Obtient l'identifiant de la liste à partir des paramètres de l'URL.
        const id = urlParams.get("id");

        fetchRead(id).then((response) => {

            if (response.status === "[Admin]user" && localStorage.token && localStorage.user) {
                displayUser(response);

                // Affiche le bouton "Retour..." uniquement pour l'Admin
                if (JSON.parse(localStorage.user).role === "Admin") {
                    const returnBtn = document.createElement("button");
                    returnBtn.id = "returnBtn";
                    returnBtn.type = "button";
                    returnBtn.title = "Revenir à la liste d'utilisateurs";
                    returnBtn.innerText = "Retour";
                    returnBtn.classList.add("btn");
                    returnBtn.classList.add("cancel");

                    // En tant qu'Admin, modifie le texte du bouton
                    listBtn.innerText = `Listes de ${response.login.value}`;
                    listBtn.title = `Listes de ${response.login.value}`;
                    listBtn.after(returnBtn);

                    // Permet la modification de l'utilisateur par l'Admin
                    updateBtn.addEventListener("click", function (e) {
                        e.preventDefault();
                        const editBtnUser = document.querySelector("#update");
                        editBtnUser.value = response.id.value

                        if (parseInt(e.target.value) !== response.id.value) {
                            return;
                        }

                        const updateProfilDiv = document.createElement("div");
                        updateProfilDiv.id = "updateProfilDiv";
                        popIn.appendChild(updateProfilDiv);

                        // Affichage du formulaire d'édition du profil
                        displayFormUpdateUser(updateProfilDiv);
                        popIn.style.visibility = "visible";

                        titleFormUser.innerText = "Formulaire d'édition de l'utilisateur";

                        // Affichage de la liste d'utilisateur + suppression du formulaire d'édition
                        cancelForm.addEventListener("click", function() {
                            updateProfilDiv.remove();
                            popIn.style.visibility = "hidden";

                        })

                        // Insertion des éléments de la liste dans les inputs
                        if (response.role.value === "User") {
                            const selectType = document.querySelector("#role");
                            selectType.value = 0;
                            const optionUser = document.querySelector("#roleUser");
                            optionUser.setAttribute("value", "User");
                            optionUser.selected = true
                        }

                        const inputId = document.querySelector("#id");
                        inputId.value = response.id.value;
                        const inputLogin = document.querySelector("#login");
                        inputLogin.value = response.login.value;
                        const inputName = document.querySelector("#name");
                        inputName.value = response.name.value;
                        const inputFirstame = document.querySelector("#firstname");
                        inputFirstame.value = response.firstname.value;
                        const inputEmail = document.querySelector("#email");
                        inputEmail.value = response.email.value;
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
                            fetchUpdateUser(formUpdateUser, response.id.value)
                            .then(response => {
                                localStorage.removeItem("csrfToken");
                                if (response.status === "[Admin]updateUser") {
                                    dialog({title: "Modification du profil par l'Admin", content: `Le profil de ${inputFirstame.value} ${inputName.value} a bien été mise à jour.`});
                                    const dialogMsg = document.querySelector("dialog");
                                    dialogMsg.classList.add("valid");
                                    redirect(`${configPath.basePath}/user/pages/profil.html?id=${inputId.value}`);
                                };

                                if (response.status === "errors") {
                                    dialog({title: "Erreurs", content: response.errors});
                                    const dialogMsg = document.querySelector("dialog");
                                    dialogMsg.classList.add("errors");
                                    redirect(`${configPath.basePath}/user/pages/profil.html?id=${inputId.value}`);
                                };
                            })
                        })
                    });

                    // En tant qu'Admin, permet la suppression d'un utilisateur via son profil
                    deleteBtn.addEventListener("click", function (e) {
                        e.preventDefault();
                        if (parseInt(id) !== response.id.value) {
                            return;
                        }

                        if (confirm(`Voulez-vous vraiment vous supprimer le compte de l'utilisateur ${response.firstname.value} ${response.name.value} ?`) === true) {
                            fetchDeleteUser(id)
                            .then(() => {
                                dialog({title: "Suppression de compte",
                                        content: `<p>Le compte de ${response.firstname.value} ${response.name.value} a bien été supprimé.</p>`});
                                redirect(`${configPath.basePath}/admin/pages/profils.html`);
                            })
                        }
                    });

                    // Permet de revenir aux listes d'utilisateurs
                    returnBtn.addEventListener("click", function (e) {
                        e.preventDefault();
                        redirect(`${configPath.basePath}/admin/pages/profils.html`, 0);
                    });
                }

                // Affiche les listes de l'utilisateur vu par l'Admin
                listBtn.addEventListener("click", function (e) {
                    e.preventDefault();
                    listBtn.disabled = true;
                    fetchReadAllLists(id).then((response) => {
                        const data = response.data;
                        const listsWrapper = document.querySelector("#listsWrapper");
                        const emptyMessage = document.createElement("p");

                        if (response.status === "standBy") {
                            emptyMessage.innerText = "Aucune liste n'a encore été créée :)"
                            listsWrapper.appendChild(emptyMessage);
                        }

                        if (response.status === "readAllListsByUser") {
                            emptyMessage.remove();
                            for (const index in data) {
                                const objectList = data[index];
                                const articleList = document.createElement("article");
                                articleList.id = `profilList-${objectList.id}`;
                                articleList.classList.add("list");
                                articleList.classList.add("grid");
                                articleList.classList.add(type[objectList.type]);

                                // Si suppression du type de liste, mettre une couleur grise aux listes
                                if (!['WishList', 'TodoList'].includes(objectList.type)) {
                                    articleList.classList.add(type.Common)
                                }

                                const sectionList = document.createElement("section");
                                sectionList.classList.add("grid_section");
                                sectionList.classList.add("pointer");
                                const typeH3 = document.createElement("h3");
                                typeH3.classList.add("grid_typeH3");
                                const titleH4 = document.createElement("h4");

                                if (objectList.type === "TodoList") {
                                    articleList.classList.add("disabled");
                                    sectionList.classList.remove("pointer");
                                }

                                for (const key in objectList) {
                                    const value = objectList[key];
                                    const text = document.createElement("p");
                                    text.classList.add("grid_text_list");

                                    if (key === "title") {
                                        titleH4.innerText = `${objectList.title}`;
                                    } else if (key === "type") {
                                        typeH3.innerText = `${objectList.type}`;
                                    }

                                    if (key === "updatedAt") {
                                        dropDownMenu(articleList, objectList.id, objectList.updatedAt, objectList.user.login);
                                    }

                                    // Exclut certains éléments de la liste
                                    if (allowedIds.includes(`${key}`)) {
                                        continue;
                                    }
                                    text.innerText = `${objectList[key]}`;

                                    listWrapper.appendChild(articleList);
                                    articleList.appendChild(typeH3);
                                    articleList.appendChild(sectionList);
                                    sectionList.appendChild(titleH4);
                                    sectionList.appendChild(text);
                                }

                                // Redirige vers la page de détails de la liste en cliquant sur la liste.
                                sectionList.addEventListener("click",  function () {
                                    if (objectList.type === "TodoList" && objectList.user.id !== JSON.parse(localStorage.user).id) {
                                        return false;
                                    }
                                    redirect(`${configPath.basePath}/list/pages/list.html?id=${objectList.id}`,0)
                                })
                            }
                        }
                    })
                })
            }
        })
    }

    // Affichage du profil utilisateur courant
    if (urlParams.size === 0) {
        fetchRead().then((response) => {
            if (response.status === "disconnected") {
                // Masque les boutons de suppression et de mise à jour lorsque l'utilisateur est déconnecté.
                deleteBtn.classList.add("hide");
                updateBtn.classList.add("hide");
            }

            if (response.status === "connected" && localStorage.token && localStorage.user) {
                // Affiche les boutons de suppression et de mise à jour lorsque l'utilisateur est connecté.
                if (JSON.parse(localStorage.user).role === "Admin") {
                    updateBtn.classList.remove("listBtn");
                    deleteBtn.remove();
                } else{
                    deleteBtn.classList.remove("hide");
                    updateBtn.classList.remove("hide");
                }
                displayUser(response);

                // Redirige l'utilisateur vers la page de listes lorsqu'il clique sur le bouton "Listes d'utilisateurs".
                listBtn.addEventListener("click", function (e) {
                    redirect(`${configPath.basePath}/list/pages/lists.html`, 0);
                });
                // Redirige l'utilisateur vers la page de mise à jour de profil lorsqu'il clique sur le bouton "Mettre à jour".
                updateBtn.addEventListener("click", function (e) {
                    redirect(
                        `${configPath.basePath}/user/pages/update.html`,
                        0
                    );
                });
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    read();
});
