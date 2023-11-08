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
    labelTitle.for = "titleCard";
    labelTitle.innerText = "Titre de la carte";

    const inputTitle = document.createElement("input");
    inputTitle.type = "text";
    inputTitle.name = "titleCard";
    inputTitle.id = "titleCard";
    inputTitle.placeholder = "Votre titre";
    inputTitle.value = "";
    inputTitle.required = true;

    const labelDescription = document.createElement("label");
    labelDescription.for = "descriptionCard";
    labelDescription.innerText = "Description";

    const inputDescription = document.createElement("input");
    inputDescription.type = "text";
    inputDescription.name = "descriptionCard";
    inputDescription.id = "descriptionCard";
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

    const CardValidFormBtn = document.createElement("button");
    CardValidFormBtn.id = "cardValidBtn";
    CardValidFormBtn.type = "submit";
    CardValidFormBtn.value = "cardValidBtn";
    CardValidFormBtn.innerText = "Valider";

    const CardCancelFormBtn = document.createElement("button");
    CardCancelFormBtn.id = "cardCancelBtn";
    CardCancelFormBtn.type = "button";
    CardCancelFormBtn.value = "cardCancelBtn";
    CardCancelFormBtn.innerText = "Annuler";

    createFormCard.appendChild(titleForm);
    createFormCard.appendChild(labelTitle);
    createFormCard.appendChild(inputTitle);
    createFormCard.appendChild(labelDescription);
    createFormCard.appendChild(inputDescription);
    createFormCard.appendChild(labelPriority);
    createFormCard.appendChild(inputPriority);
    createFormCard.appendChild(CardValidFormBtn);
    createFormCard.appendChild(CardCancelFormBtn);

    newCard.appendChild(createFormCard);
}

export {createCardForm};