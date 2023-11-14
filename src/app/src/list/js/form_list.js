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

    const radioW = document.createElement("input");
    radioW.type = "radio";
    radioW.name = "type";
    radioW.id = "wish";
    radioW.value = "WishList";
    radioW.checked = true;

    const labelW = document.createElement("label");
    labelW.htmlFor  = "wish";
    labelW.innerText = "WishList";

    const radioT = document.createElement("input");
    radioT.type = "radio";
    radioT.name = "type";
    radioT.id = "todo";
    radioT.value = "TodoList";

    const labelT = document.createElement("label");
    labelT.htmlFor  = "todo";
    labelT.innerText = "TodoList";

    const labelTitle = document.createElement("label");
    labelTitle.htmlFor  = "titleList";
    labelTitle.innerText = "Titre de la liste";

    const inputTitle = document.createElement("input");
    inputTitle.type = "text";
    inputTitle.name = "titleList";
    inputTitle.id = "titleList";
    inputTitle.placeholder = "Votre titre";
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
    formList.appendChild(radioW);
    formList.appendChild(labelW);
    formList.appendChild(radioT);
    formList.appendChild(labelT);
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