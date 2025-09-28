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
 * Génère un formulaire pour insérer le login du réservant d'une carte.
 *
 * @param {HTMLElement} elementDOM - L'élément HTML dans lequel le formulaire de réesrvation sera généré.
 */
function displayFormReservation(elementDOM) {
    const createFormGuest = document.createElement("form");
    createFormGuest.id = "formGuest";
    createFormGuest.classList.add("formGuest");

    const reservationTitle = document.createElement("h3");
    reservationTitle.innerText = "Formulaire de réservation";

    const labelGuestName = document.createElement("label");
    labelGuestName.htmlFor  = "name";
    labelGuestName.innerText = 'Votre login ou prénom';

    const inputGuestName = document.createElement("input");
    inputGuestName.type = "text";
    inputGuestName.id = "name";
    inputGuestName.name = "name";
    inputGuestName.placeholder = "Votre login ou prénom";
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
    inputGuestMail.pattern = "[^@\\s]+@[^@\\s]+\\.[a-zA-Z]{2,}";
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

    createFormGuest.appendChild(reservationTitle);
    createFormGuest.appendChild(labelGuestName);
    labelGuestName.appendChild(mandatoryStar.cloneNode(true));
    createFormGuest.appendChild(inputGuestName);
    createFormGuest.appendChild(labelGuestMail);
    labelGuestMail.appendChild(mandatoryStar.cloneNode(true));
    createFormGuest.appendChild(inputGuestMail);
    createFormGuest.appendChild(guestValidFormBtn);
    createFormGuest.appendChild(guestCancelFormBtn);

    elementDOM.appendChild(createFormGuest);
}

export { displayFormReservation };