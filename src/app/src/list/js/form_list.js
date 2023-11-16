"use strict";

import { mandatoryStar } from "../../services/utils.js";

/**
 * Génère un formulaire de mise à jour pour une liste.
 *
 * @param {HTMLElement} elementDOM - L'élément HTML dans lequel le formulaire de mise à jour sera généré.
 */
function displayFormList(elementDOM) {
    const sectionForm = document.createElement("section");
    sectionForm.id = "listFormSection";

    const formList = document.createElement("form");
    formList.id = "formList";

    const titleForm = document.createElement("h3");
    titleForm.id = "titleFormList";

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
    inputTitle.placeholder = "Votre titre";
    inputTitle.setAttribute("max", 20);
    inputTitle.value = "";
    inputTitle.required = true;

    const labelDescription = document.createElement("label");
    labelDescription.htmlFor  = "descriptionList";
    labelDescription.innerText = "Description (facultative)";

    const inputDescription = document.createElement("input");
    inputDescription.type = "text";
    inputDescription.name = "descriptionList";
    inputDescription.id = "descriptionList";
    inputDescription.placeholder = "Votre description";
    inputDescription.value = ``;

    const validListBtn = document.createElement("button");
    validListBtn.id = "validForm";
    validListBtn.classList.add("btn");
    validListBtn.classList.add("valid");
    validListBtn.type = "submit";
    validListBtn.value = "validForm";
    validListBtn.innerText = "Valider";

    const cancelListBtn = document.createElement("button");
    cancelListBtn.id = "cancelForm";
    cancelListBtn.classList.add("btn");
    cancelListBtn.classList.add("cancel");
    cancelListBtn.type = "button";
    cancelListBtn.value = "cancelForm";
    cancelListBtn.innerText = "Annuler";

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
    formList.appendChild(inputDescription);
    formList.appendChild(validListBtn);
    formList.appendChild(cancelListBtn);

    elementDOM.appendChild(sectionForm);
}

export { displayFormList };