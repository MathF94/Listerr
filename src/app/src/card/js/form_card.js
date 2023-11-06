"use strict";

/**
 * Génère un formulaire de mise à jour pour une liste.
 *
 * @param {HTMLElement} createCard - L'élément HTML dans lequel le formulaire de mise à jour sera généré.
 */
function createCardForm(newCard) {
    const createFormCard = document.createElement("form");
    createFormCard.id = "createFormCard";

    const titleForm = document.createElement("h3");
    titleForm.innerText = "Formulaire de création de cartes";

    const labelTitle = document.createElement("label");
    labelTitle.for = "title";
    labelTitle.innerText = "Titre de la carte";

    const inputTitle = document.createElement("input");
    inputTitle.type = "text";
    inputTitle.name = "title";
    inputTitle.id = "title";
    inputTitle.placeholder = "Votre titre";
    inputTitle.value = "";
    inputTitle.required = true;

    const labelDescription = document.createElement("label");
    labelDescription.for = "description";
    labelDescription.innerText = "Description";

    const inputDescription = document.createElement("input");
    inputDescription.type = "text";
    inputDescription.name = "description";
    inputDescription.id = "description";
    inputDescription.placeholder = "Votre description";
    inputDescription.value = ``;

    const labelPriority = document.createElement("label");
    labelPriority.for = "priority";
    labelPriority.innerText = "Priorité";


    const inputPriority = document.createElement("input");
    inputPriority.type = "number";
    inputPriority.name = "priority";
    inputPriority.id = "priority";
    inputPriority.value = "1";
    inputPriority.placeholder = "Niveau de priorité de 1 à 5";
    inputPriority.min = 1;
    inputPriority.max = 5;
    inputPriority.required = true;

    const createBtnCardValid = document.createElement("button");
    createBtnCardValid.id = "CardValidBtn";
    createBtnCardValid.type = "submit";
    createBtnCardValid.value = "CardValidBtn";
    createBtnCardValid.innerText = "Valider";

    const createBtnCardCancel = document.createElement("button");
    createBtnCardCancel.id = "CardCancelBtn";
    createBtnCardCancel.type = "submit";
    createBtnCardCancel.value = "CardCancelBtn";
    createBtnCardCancel.innerText = "Annuler";

    createFormCard.appendChild(titleForm);
    createFormCard.appendChild(labelTitle);
    createFormCard.appendChild(inputTitle);
    createFormCard.appendChild(labelDescription);
    createFormCard.appendChild(inputDescription);
    createFormCard.appendChild(labelPriority);
    createFormCard.appendChild(inputPriority);
    createFormCard.appendChild(createBtnCardValid);
    createFormCard.appendChild(createBtnCardCancel);

    newCard.appendChild(createFormCard);
}

export {createCardForm};