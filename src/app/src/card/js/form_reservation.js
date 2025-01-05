"use strict";

/**
 * Génère un formulaire pour insérer le login du réservant d'une carte.
 *
 * @param {HTMLElement} elementDOM - L'élément HTML dans lequel le formulaire de réesrvation sera généré.
 */
function displayFormReservation(elementDOM) {
    const createFormGuest = document.createElement("form");
    createFormGuest.id = "formGuest";
    createFormGuest.classList.add("grid_form_guest");

    const labelGuestName = document.createElement("label");
    labelGuestName.htmlFor  = "name";

    const inputGuestName = document.createElement("input");
    inputGuestName.type = "text";
    inputGuestName.id = "name";
    inputGuestName.name = "name";
    inputGuestName.placeholder = "Votre pseudo";
    inputGuestName.setAttribute("max", 20);
    inputGuestName.required = true;

    const labelGuestMail = document.createElement("label");
    labelGuestMail.htmlFor  = "email";
    labelGuestMail.innerText = "Votre mail";

    const inputGuestMail = document.createElement("input");
    inputGuestMail.type = "email";
    inputGuestMail.id = "email";
    inputGuestMail.name = "email";
    inputGuestMail.placeholder = "Votre mail";
    inputGuestMail.pattern = "[^@\s]+@[^@\s]+\.[a-zA-Z]{2,}";
    inputGuestMail.required = true;

    const guestValidFormBtn = document.createElement("button");
    guestValidFormBtn.id = "guestValidBtn";
    guestValidFormBtn.type = "submit";
    guestValidFormBtn.value = "guestValidBtn";
    guestValidFormBtn.title = "Valider la réservation d'une carte";
    guestValidFormBtn.textContent = "Valider";
    guestValidFormBtn.classList.add("btn");
    guestValidFormBtn.classList.add("form_guest");
    guestValidFormBtn.classList.add("valid");

    const guestCancelFormBtn = document.createElement("button");
    guestCancelFormBtn.id = "guestCancelBtn";
    guestCancelFormBtn.type = "button";
    guestCancelFormBtn.value = "guestCancelBtn";
    guestCancelFormBtn.title = "Annuler la réservation d'une carte";
    guestCancelFormBtn.innerText = "Annuler";
    guestCancelFormBtn.classList.add("btn");
    guestCancelFormBtn.classList.add("form_guest");
    guestCancelFormBtn.classList.add("cancel");

    createFormGuest.appendChild(labelGuestName);
    createFormGuest.appendChild(inputGuestName);
    createFormGuest.appendChild(labelGuestMail);
    createFormGuest.appendChild(inputGuestMail);
    createFormGuest.appendChild(guestValidFormBtn);
    createFormGuest.appendChild(guestCancelFormBtn);

    elementDOM.appendChild(createFormGuest);
}

export { displayFormReservation };