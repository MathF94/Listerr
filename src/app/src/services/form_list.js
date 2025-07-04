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

import { mandatoryStar } from "../services/utils.js";

/**
 * Génère un formulaire de mise à jour pour une liste.
 *
 * @param {HTMLElement} elementDOM - L'élément HTML dans lequel le formulaire de mise à jour sera généré.
 */
function displayFormList(elementDOM) {
    const sectionForm = document.createElement("section");
    sectionForm.id = "listFormSection";

    const titleForm = document.createElement("h3");
    titleForm.id = "titleFormList";

    const formList = document.createElement("form");
    formList.id = "formList";

    const labelType = document.createElement("label");
    labelType.htmlFor  = "typeList";
    labelType.innerText = "Type de liste";

    const selectType = document.createElement("select");
    selectType.id = "typeList";
    selectType.name = "typeList";
    selectType.value = 0;

    const optionWish = document.createElement("option");
    optionWish.value = "Type de liste";
    optionWish.id = "optWishList";
    optionWish.setAttribute("value", "WishList");
    optionWish.innerText = "WishList"

    const optionTodo = document.createElement("option");
    optionTodo.value = "Type de liste";
    optionTodo.id = "optTodoList";
    optionTodo.setAttribute("value", "TodoList");
    optionTodo.innerText = "TodoList"

    const labelTitle = document.createElement("label");
    labelTitle.htmlFor  = "titleList";
    labelTitle.innerText = "Titre de la liste";

    const inputTitle = document.createElement("input");
    inputTitle.type = "text";
    inputTitle.name = "titleList";
    inputTitle.id = "titleList";
    inputTitle.placeholder = "Anniversaire, Noël, Outils, Autres, etc.";
    inputTitle.value = "";
    inputTitle.required = true;

    const labelDescription = document.createElement("label");
    labelDescription.htmlFor  = "descriptionList";
    labelDescription.innerText = "Description";

    const textAreaDescription = document.createElement("textarea");
    textAreaDescription.name = "descriptionList";
    textAreaDescription.id = "descriptionList";
    textAreaDescription.placeholder = "Livres, voyages, jouets, jeux de société, jeux vidéos, etc.";
    textAreaDescription.value = "";

    const actionBtnList = document.createElement("div");
    actionBtnList.id = 'actionBtnList';

    const listValidFormBtn = document.createElement("button");
    listValidFormBtn.id = "validForm";
    listValidFormBtn.classList.add("btn");
    listValidFormBtn.classList.add("valid");
    listValidFormBtn.type = "submit";
    listValidFormBtn.value = "validForm";
    listValidFormBtn.innerText = "Valider";

    const listCancelFormBtn = document.createElement("button");
    listCancelFormBtn.id = "cancelForm";
    listCancelFormBtn.classList.add("btn");
    listCancelFormBtn.classList.add("cancel");
    listCancelFormBtn.type = "button";
    listCancelFormBtn.value = "cancelForm";
    listCancelFormBtn.innerText = "Annuler";

    sectionForm.appendChild(titleForm);
    sectionForm.appendChild(formList);
    formList.appendChild(labelType);
    formList.appendChild(selectType);
    selectType.appendChild(optionWish);
    selectType.appendChild(optionTodo);
    formList.appendChild(labelTitle);
    labelTitle.appendChild(mandatoryStar);
    formList.appendChild(inputTitle);
    formList.appendChild(labelDescription);
    formList.appendChild(textAreaDescription);
    formList.appendChild(actionBtnList);
    actionBtnList.appendChild(listValidFormBtn);
    actionBtnList.appendChild(listCancelFormBtn);

    elementDOM.appendChild(sectionForm);
}

export { displayFormList };