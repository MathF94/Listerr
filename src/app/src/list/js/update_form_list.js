"use strict";

/**
 * Génère un formulaire de mise à jour pour une liste.
 *
 * @param {HTMLElement} updateList - L'élément HTML dans lequel le formulaire de mise à jour sera généré.
 */
function createUpdateForm(updateList) {
    const updateFormList = document.createElement("form");
    updateFormList.id = "updateFormList";

    const titleForm = document.createElement("h3");
    titleForm.innerText = "Formulaire d'édition de la liste";

    const radioW = document.createElement("input");
    radioW.type = "radio";
    radioW.name = "type";
    radioW.id = "wish";
    radioW.value = "WishList";
    radioW.checked = true;

    const labelW = document.createElement("label");
    labelW.for = "wish";
    labelW.innerText = "WishList";

    const radioT = document.createElement("input");
    radioT.type = "radio";
    radioT.name = "type";
    radioT.id = "todo";
    radioT.value = "TodoList";

    const labelT = document.createElement("label");
    labelT.for = "todo";
    labelT.innerText = "TodoList";

    const labelTitle = document.createElement("label");
    labelTitle.for = "title";
    labelTitle.innerText = "Titre de la liste";

    const inputTitle = document.createElement("input");
    inputTitle.type = "text";
    inputTitle.name = "title";
    inputTitle.id = "title";
    inputTitle.placeholder = "Votre titre";
    inputTitle.value = "";
    inputTitle.required = true;

    const inputDescription = document.createElement("input");
    inputDescription.type = "text";
    inputDescription.name = "description";
    inputDescription.id = "description";
    inputDescription.placeholder = "Votre description";
    inputDescription.value = ``;

    const labelDescription = document.createElement("label");
    labelDescription.for = "description";
    labelDescription.innerText = "Description (facultative)";

    const updateBtnListValid = document.createElement("button");
    updateBtnListValid.id = "updateBtnListValid";
    updateBtnListValid.type = "submit";
    updateBtnListValid.value = "updateBtnListValid";
    updateBtnListValid.innerText = "Valider";

    const updateBtnListCancel = document.createElement("button");
    updateBtnListCancel.id = "updateBtnListCancel";
    updateBtnListCancel.type = "button";
    updateBtnListCancel.value = "updateBtnListCancel";
    updateBtnListCancel.innerText = "Annuler";

    updateFormList.appendChild(titleForm);
    updateFormList.appendChild(radioW);
    updateFormList.appendChild(labelW);
    updateFormList.appendChild(radioT);
    updateFormList.appendChild(labelT);
    updateFormList.appendChild(labelTitle);
    updateFormList.appendChild(inputTitle);
    updateFormList.appendChild(labelDescription);
    updateFormList.appendChild(inputDescription);
    updateFormList.appendChild(updateBtnListValid);
    updateFormList.appendChild(updateBtnListCancel);

    updateList.appendChild(updateFormList);
}

export {createUpdateForm};