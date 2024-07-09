"use strict";

import { mandatoryStar } from "../../services/utils.js";

/**
 * Génère un formulaire de mise à jour pour une liste.
 *
 * @param {HTMLElement} elementDOM - L'élément HTML dans lequel le formulaire de mise à jour sera généré.
 */
function displayFormCard(elementDOM) {
    const createFormCard = document.createElement("form");
    createFormCard.id = "formCard";

    const labelTitle = document.createElement("label");
    labelTitle.htmlFor  = "titleCard";
    labelTitle.innerText = "Titre de la carte";

    const inputTitle = document.createElement("input");
    inputTitle.type = "text";
    inputTitle.name = "titleCard";
    inputTitle.id = "titleCard";
    inputTitle.placeholder = "Votre titre";
    inputTitle.setAttribute("max", 20);
    inputTitle.value = "";
    inputTitle.required = true;

    const labelDescription = document.createElement("label");
    labelDescription.htmlFor  = "descriptionCard";
    labelDescription.innerText = "Description";

    const inputDescription = document.createElement("input");
    inputDescription.type = "text";
    inputDescription.name = "descriptionCard";
    inputDescription.id = "descriptionCard";
    inputDescription.placeholder = "Votre description";
    inputDescription.value = "";

    const labelPriority = document.createElement("label");
    labelPriority.htmlFor  = "priority";
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

    const cardValidFormBtn = document.createElement("button");
    cardValidFormBtn.id = "cardValidBtn";
    cardValidFormBtn.type = "submit";
    cardValidFormBtn.value = "cardValidBtn";
    cardValidFormBtn.title = "Valider la création d'une carte";
    cardValidFormBtn.innerText = "Valider";
    cardValidFormBtn.classList.add("btn");
    cardValidFormBtn.classList.add("valid");

    const cardCancelFormBtn = document.createElement("button");
    cardCancelFormBtn.id = "cardCancelBtn";
    cardCancelFormBtn.type = "button";
    cardCancelFormBtn.value = "cardCancelBtn";
    cardCancelFormBtn.title = "Annuler la création d'une carte";
    cardCancelFormBtn.innerText = "Annuler";
    cardCancelFormBtn.classList.add("btn");
    cardCancelFormBtn.classList.add("cancel");

    createFormCard.appendChild(labelTitle);
    labelTitle.appendChild(mandatoryStar.cloneNode(true));
    createFormCard.appendChild(inputTitle);
    createFormCard.appendChild(labelDescription);
    createFormCard.appendChild(inputDescription);
    createFormCard.appendChild(labelPriority);
    labelPriority.appendChild(mandatoryStar.cloneNode(true));
    createFormCard.appendChild(inputPriority);
    createFormCard.appendChild(cardValidFormBtn);
    createFormCard.appendChild(cardCancelFormBtn);

    elementDOM.appendChild(createFormCard);
}

export { displayFormCard };