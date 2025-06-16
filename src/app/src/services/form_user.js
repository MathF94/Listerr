/*
 * listerr - gestionnaire de listes et tâches
 * Copyright (C) 2025 Mathieu Fagot
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

"use strict";

/**
 * Génère un formulaire de mise à jour pour un utilisateur ETQ Admin.
 *
 * @param {HTMLElement} elementDOM - L'élément HTML dans lequel le formulaire de mise à jour sera généré.
 */
function displayFormUpdateUser(elementDOM) {
    const sectionForm = document.createElement("section");
    sectionForm.id = "userFormSection";
    sectionForm.classList = "userFormSection";

    const updateFormUser = document.createElement("form");
    updateFormUser.id = "formUpdateUser";

    const titleForm = document.createElement("h3");
    titleForm.id = "titleFormUser";

    const inputId = document.createElement("input");
    inputId.type = "hidden";
    inputId.name = "updateId";
    inputId.id = "id";
    inputId.value = "";
    inputId.required = true;

    const labelName = document.createElement("label");
    labelName.htmlFor = "name";
    labelName.innerText = "Son nom";

    const inputName = document.createElement("input");
    inputName.type = "text";
    inputName.name = "name";
    inputName.id = "name";
    inputName.placeholder = "Son nom";
    inputName.setAttribute("max", 20);
    inputName.value = "";
    inputName.required = true;

    const labelFirstname = document.createElement("label");
    labelFirstname.htmlFor = "firstname";
    labelFirstname.innerText = "Son prénom";

    const inputFirstname = document.createElement("input");
    inputFirstname.type = "text";
    inputFirstname.name = "firstname";
    inputFirstname.id = "firstname";
    inputFirstname.placeholder = "Son prénom";
    inputFirstname.setAttribute("max", 20);
    inputFirstname.value = "";
    inputFirstname.required = true;

    const labelLogin = document.createElement("label");
    labelLogin.htmlFor = "login";
    labelLogin.innerText = "Son login";

    const inputLogin = document.createElement("input");
    inputLogin.type = "text";
    inputLogin.name = "login";
    inputLogin.id = "login";
    inputLogin.placeholder = "Son login";
    inputLogin.setAttribute("max", 20);
    inputLogin.value = "";
    inputLogin.required = true;

    const labelEmail = document.createElement("label");
    labelEmail.htmlFor = "email";
    labelEmail.innerText = "Son email";

    const inputEmail = document.createElement("input");
    inputEmail.type = "text";
    inputEmail.name = "email";
    inputEmail.id = "email";
    inputEmail.placeholder = "Son email";
    inputEmail.setAttribute("max", 20);
    inputEmail.value = "";
    inputEmail.required = true;

    const labelRole = document.createElement("label");
    labelRole.htmlFor = "role";
    labelRole.innerText = "Son rôle";

    const selectType = document.createElement("select");
    selectType.id = "role";
    selectType.name = "role";
    selectType.value = 0;

    const optionAdmin = document.createElement("option");
    optionAdmin.value = "Rôle de l'utilisateur";
    optionAdmin.id = "roleAdmin";
    optionAdmin.setAttribute("value", "Admin");
    optionAdmin.innerText = "Admin";

    const optionUser = document.createElement("option");
    optionUser.value = "Rôle de l'utilisateur";
    optionUser.id = "roleUser";
    optionUser.setAttribute("value", "User");
    optionUser.innerText = "User";

    const validUpdateBtn = document.createElement("button");
    validUpdateBtn.id = "validForm";
    validUpdateBtn.classList.add("btn");
    validUpdateBtn.classList.add("valid");
    validUpdateBtn.type = "submit";
    validUpdateBtn.value = "validForm";
    validUpdateBtn.innerText = "Valider";

    const cancelUpdateBtn = document.createElement("button");
    cancelUpdateBtn.id = "cancelForm";
    cancelUpdateBtn.classList.add("btn");
    cancelUpdateBtn.classList.add("cancel");
    cancelUpdateBtn.type = "button";
    cancelUpdateBtn.value = "cancelForm";
    cancelUpdateBtn.innerText = "Annuler";

    sectionForm.appendChild(titleForm);
    sectionForm.appendChild(updateFormUser);
    updateFormUser.appendChild(inputId);
    updateFormUser.appendChild(labelRole);
    updateFormUser.appendChild(selectType);
    selectType.appendChild(optionAdmin);
    selectType.appendChild(optionUser);
    updateFormUser.appendChild(labelName);
    updateFormUser.appendChild(inputName);
    updateFormUser.appendChild(labelFirstname);
    updateFormUser.appendChild(inputFirstname);
    updateFormUser.appendChild(labelLogin);
    updateFormUser.appendChild(inputLogin);
    updateFormUser.appendChild(labelEmail);
    updateFormUser.appendChild(inputEmail);
    updateFormUser.appendChild(validUpdateBtn);
    updateFormUser.appendChild(cancelUpdateBtn);

    elementDOM.appendChild(sectionForm);
}

export { displayFormUpdateUser };
