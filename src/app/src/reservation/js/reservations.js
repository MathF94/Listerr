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

import {
    fetchReadAllReservations,
    // fetchCancelReservation
} from '../../actions/actions_reservation.js';

import { CSRFToken } from "../../services/CSRFToken.js";

import {
    configPath,
    detail,
    dialog,
    manageBtns,
    notAllowedRedirection,
    redirect,
    scroll,
    validate
} from '../../services/utils.js';


notAllowedRedirection();

function reservations() {
    const titlePage = document.querySelector("h2");
    const login = JSON.parse(localStorage.user).login

    titlePage.innerText= `Affichage des souhaits réservés par ${login}`;

    const linkLists = document.querySelector("#lists");
    const linkReservations = document.querySelector("#reservations");
    const linkProfil = document.querySelector("#profil");
    linkReservations.classList.add("active");
    linkLists.classList.remove("active");
    linkProfil.classList.remove("active");

    const reservationsArticle = document.querySelector('#reservationsArticle');
    const popIn = document.createElement("div");
    popIn.id = "popIn";
    popIn.classList.add("popIn");

    fetchReadAllReservations()
    .then (response => {
        if (response.status === "standBy") {
            const emptyMessage = document.createElement("p");
            emptyMessage.innerText = "Aucune réservation n'a encore été faite :)"
            reservationsArticle.appendChild(emptyMessage);
        }

        if (response.status === "readAllReservationsByUser") {
            const data = response.data;

            const userId = JSON.parse(localStorage.user).id;
            const emailUser = JSON.parse(localStorage.user).email;
            const headReservationsSection = document.querySelector("#headReservationsSection");
            const reservationsSection = document.createElement("section");
            reservationsSection.id = "reservationsSection";

            for (const index in data) {
                const object = data[index];
                const arrayCard = object.cards;
                const arrayReservation = object.reservations;

                if (arrayReservation.length > 0) {
                    for (const index in arrayReservation) {
                        const objectCards = arrayCard[index];
                        const objectReservation = arrayReservation[index];
                        if (objectReservation.email !== emailUser) {
                            continue;
                        }

                        if (objectReservation.email === emailUser) {
                            const reservationsArticle = document.createElement("article");
                            reservationsArticle.id = `reservationsArticle-${objectReservation.id}`
                            reservationsArticle.classList.add("reservations");
                            reservationsArticle.classList.add("wish");
                            reservationsArticle.classList.add("grid_reservations");

                            const typeList = document.createElement("h3");
                            const titleList = document.createElement("h4");
                            const sectionList = document.createElement("section");
                            const textWish = document.createElement("p");
                            const detailReservation = document.createElement("small");

                            typeList.id = `typeList-${object.id}`;
                            typeList.classList.add("grid_typeH3")
                            typeList.innerText = `${object.type} \n ${object.title}`;

                            sectionList.id = "sectionTxt";
                            sectionList.classList.add("grid_text_list");

                            titleList.innerText = `${object.description}`;

                            textWish.innerText = `${objectCards.description}`;
                            
                            detailReservation.innerText = detail(objectReservation.createdAt, objectReservation.name);

                            headReservationsSection.appendChild(reservationsSection);
                            reservationsSection.appendChild(reservationsArticle);
                            reservationsArticle.appendChild(typeList);
                            reservationsArticle.appendChild(sectionList);

                            if (objectReservation.cardId === objectCards.id){
                                sectionList.appendChild(titleList);
                                sectionList.appendChild(textWish);
                                sectionList.appendChild(detailReservation);
                            }
                        }
                    }

                }
            }
        }
    })
    // Permet de récupérer les erreurs du .then
    .catch(e=>console.error(e))
}
document.addEventListener("DOMContentLoaded", () => {
    reservations();
});