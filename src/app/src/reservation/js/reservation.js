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
    fetchCreateReservation,
    fetchReadAllReservationsByCard,
    fetchUpdatePriority,
    fetchCancelReservation
} from '../../actions/actions_reservation.js';

import { displayFormReservation } from "../../services/form_reservation.js";

import { CSRFToken } from "../../services/CSRFToken.js";

import {
    configPath,
    dialog,
    manageBtns,
    redirect,
    scroll,
validate
} from '../../services/utils.js';

/**
 * Gestion de la réservation d'un souhait / tâche d'une carte dans une liste
 */
function reservation(
    id,
    responseList,
    canCreateCard,
    userId,
    userLogin,
    userEmail,
    dataUserEmail,
    objectCard,
    divStar,
    reservationBtn,
    dltReservationBtn,
    reservationTxt,
    dataUserId
) {

    const dataType = responseList.data.type;
    reservationBtn.addEventListener("click", function(e) {
        e.preventDefault();
        const updateReservationDiv = document.createElement("div");
        updateReservationDiv.id = "updateReservationDiv";
        popIn.style.visibility = "visible";

        popIn.appendChild(updateReservationDiv);

        // Affichage du formulaire pour réserver
        displayFormReservation(updateReservationDiv);

        const inputLogin = document.querySelector("#name");
        const inputMail = document.querySelector("#email");
        inputLogin.value = userLogin;
        inputMail.value = userEmail;

        // Si invité n'a pas de compte, il peut quand même réserver
        if (localStorage.user === null || localStorage.user === undefined || localStorage.token === null || localStorage.token === undefined) {
            guestCancelBtn.addEventListener("click", function() {
                popIn.style.visibility = "hidden";
                updateReservationDiv.remove();
            })

            CSRFToken(formGuest.id);
            formGuest.addEventListener("submit", function(e) {
                e.preventDefault();
                reservationBtn.disabled = false;

                // Validation de pattern du formulaire
                inputLogin.addEventListener("invalid", function(e) {
                    validate(e.target)
                });
                inputMail.addEventListener("invalid", function(e) {
                    validate(e.target)
                });

                scroll();
                fetchCreateReservation(formGuest, objectCard.listId, objectCard.id)
                .then(response => {
                    localStorage.removeItem("csrfToken");
                    if (response.status === "createReservation") {
                        dialog({title: "Création de la réservation", content: "Votre réservation a bien été prise en compte."});
                        const dialogMsg = document.querySelector("dialog");
                        dialogMsg.classList.add("valid");
                        redirect(`${configPath.basePath}/list/pages/list.html?id=${id}`);

                    }
                    if (response.status === "errors") {
                        dialog({title: "Erreurs", content: response.errors});
                        const dialogMsg = document.querySelector("dialog");
                        dialogMsg.classList.add("errors");
                        redirect(`${configPath.basePath}/list/pages/list.html?id=${id}`);
                    }
                })
            })
        }

        // Si utilisateur est connecté, il peut réserver une carte d'un autre utilisateur
        if (!canCreateCard && localStorage.user !== undefined && localStorage.token !== null && localStorage.user !== null && localStorage.token !== undefined) {
            guestCancelBtn.addEventListener("click", function() {
                popIn.style.visibility = "hidden";
                updateReservationDiv.remove();
            })

            CSRFToken(formGuest.id);
            formGuest.addEventListener("submit", function(e) {
                e.preventDefault();
                reservationBtn.disabled = false;

                // Validation de pattern du formulaire
                inputLogin.addEventListener("invalid", function(e) {
                    validate(e.target)
                });
                inputMail.addEventListener("invalid", function(e) {
                    validate(e.target)
                });

                scroll();
                fetchCreateReservation(formGuest, objectCard.listId, objectCard.id)
                .then(response => {
                    localStorage.removeItem("csrfToken");
                    if (response.status === "createReservation") {
                        dialog({title: "Création de la réservation", content: "Votre réservation a bien été prise en compte."});
                        const dialogMsg = document.querySelector("dialog");
                        dialogMsg.classList.add("valid");
                        redirect(`${configPath.basePath}/list/pages/list.html?id=${id}`);
                    }
                    if (response.status === "errors") {
                        dialog({title: "Erreurs", content: response.errors});
                        const dialogMsg = document.querySelector("dialog");
                        dialogMsg.classList.add("errors");
                        redirect(`${configPath.basePath}/list/pages/list.html?id=${id}`);
                    }
                })
            })
        }

        // L'utilisateur peut réserver des cartes dans sa propre liste
        if (canCreateCard) {
            guestCancelBtn.addEventListener("click", function() {
                popIn.style.visibility = "hidden";
                updateReservationDiv.remove();

                // Réservation cachée
                reservationBtn.hidden = false;

                // Etoiles de priorité visibles
                divStar.classList.remove("hidden");
            })
            manageBtns('.reservation', 'disable', 'reservation', guestCancelBtn)
            manageBtns('.stars', 'disableStars', 'stars', guestCancelBtn)
            manageBtns('.delete', 'disableDelete', 'delete', guestCancelBtn);

            CSRFToken(formGuest.id);
            formGuest.addEventListener("submit", function(e) {
                e.preventDefault();
                reservationBtn.disabled = false;

                // Validation de pattern du formulaire
                inputLogin.addEventListener("invalid", function(e) {
                    validate(e.target)
                });
                inputMail.addEventListener("invalid", function(e) {
                    validate(e.target)
                });

                scroll();
                fetchCreateReservation(formGuest, objectCard.listId, objectCard.id)
                .then(response => {
                    localStorage.removeItem("csrfToken");

                    if (response.status === "createReservation") {
                        dialog({title: "Création de la réservation", content: "Votre réservation a bien été prise en compte."});
                        const dialogMsg = document.querySelector("dialog");
                        dialogMsg.classList.add("valid");
                        redirect(`${configPath.basePath}/list/pages/list.html?id=${id}`);

                    }
                    if (response.status === "errors") {
                        dialog({title: "Erreurs", content: response.errors});
                        const dialogMsg = document.querySelector("dialog");
                        dialogMsg.classList.add("errors");
                        redirect(`${configPath.basePath}/list/pages/list.html?id=${id}`);
                    }
                })
            })
        }
    })

    // Gestion d'affichage d'une réservation faite
    fetchReadAllReservationsByCard(objectCard.id)
    .then(response => {
        // Boucle de création des étoiles (pleines ou vides) en fonction de la priorité
        const priorityValue = objectCard.priority;
        for (let i = 0 ; i < 5; i++) {
            const priority = document.createElement("span");
            priority.id = `${i+1}-${objectCard.id}`;

            // Définit la couleur des étoiles si l'utilisateur courant n'est pas le proprio de la carte
            //                                si la liste est une TodoList
            if ((!canCreateCard) || (dataType === "TodoList")) {
                priority.classList.add("third_party_stars");
            } else {
                priority.classList.add("stars");
            }

            priority.setAttribute("data-star", i+1);
            priority.textContent = i < priorityValue ? "\u2605" : "\u2606" ;
            divStar.title = `nombre d'étoiles ${priorityValue}`;
            divStar.appendChild(priority);

            if (response === null) {
                return
            }
            // En attente de réservation
            if (response?.status === 'in pending reservation') {
                reservationTxt.remove();
                // Si l'utilisateur courant n'est pas le proprio de la carte, alors il ne peut pas modifier la priorité
                if (!canCreateCard) {
                    priority.classList.remove("stars");
                    priority.classList.add("disableStars");
                } else {
                    // Gestion de la modification de la priorité sur ordinateur
                    priority.addEventListener("click", function (e) {
                        e.preventDefault();
                        updatePriority(e)
                    })

                    // Gestion de la modification de la priorité sur smartphone
                    priority.addEventListener("touchstart", function (e) {
                        e.preventDefault();
                        updatePriority(e)
                    })
                }

                function updatePriority(e) {
                    fetchUpdatePriority(e.target.dataset.star, objectCard.id)
                    .then(response => {
                        if (response.status === "updatePriority") {
                            if (localStorage.getItem("userTypeList") === "WishList") {
                                dialog({title: "Modification du souhait", content: "Votre priorité a bien été mis à jour."});
                            } else {
                                dialog({title: "Modification de la tâche", content: "Votre importance a bien été mise à jour."});
                            }
                            const dialogMsg = document.querySelector("dialog");
                            dialogMsg.classList.add("valid");
                            redirect(`${configPath.basePath}/list/pages/list.html?id=${id}`);
                        }

                        if (response.status === "errors") {
                            dialog({title: "Erreurs", content: response.errors});
                            const dialogMsg = document.querySelector("dialog");
                            dialogMsg.classList.add("errors");
                            redirect(`${configPath.basePath}/list/pages/list.html?id=${id}`);
                        }
                    })
                }
            }

            // Réservation actée
            if (response?.status === "readOneReservation") {
                const dataReservation = response?.dataReservation;

                // Etoile inutilisables
                priority.classList.remove("stars");
                priority.classList.add("disableStars");

                // CSS pour modifier le bouton de réservation et texte
                // Si une réservation est faite, le bouton de réservation disparaît
                reservationBtn.remove();

                let reservationLabel = null;

                // CAS PROPRIETAIRE : Si le propriétaire de la carte est sur sa propre carte
                // - il lit "Réservé" uniquement si qqun a réservé une carte et peut supprimer
                if (userId === dataUserId && dataUserEmail !== dataReservation.email) {
                    // On est connecté, proprio, pas réservant";
                    reservationLabel = "Réservé"
                    dltReservationBtn.classList.add("hidden");
                }

                // - il lit "Réservé par moi" s'il réserve sa propre carte et peut supprimer
                if (userId === dataUserId && dataUserEmail === dataReservation.email) {
                    // On est connecté, proprio, réservant ma propre carte";

                    reservationLabel = "Réservé par moi";
                }
                reservationTxt.innerText = reservationLabel;
                reservationTxt.appendChild(dltReservationBtn);

                // Dans le cas d'une TodoList, on affiche "En cours par ..."
                if (userId === dataUserId && dataUserEmail === dataReservation.email && localStorage.getItem("typeList") === "TodoList") {
                    reservationLabel = `En cours`;
                }
                reservationTxt.innerText = reservationLabel;
                reservationTxt.appendChild(dltReservationBtn);

                // CAS VISITEUR INSCRIT / CONNECTE est sur la carte d'un autre utilisateur
                // - s'il n'est pas réservant, il lit "Réservé par ..." et ne peut supprimer la réservation
                if (userId !== null && userId !== dataUserId && userEmail !== dataReservation.email) {
                    // On est inscrit / connecté, invité et pas réservant";
                    reservationLabel = `Réservé par ${dataReservation.name}`;
                    dltReservationBtn.classList.add("hidden");
                }

                // - s'il est réservant, il lit "Réservé par moi" et peut supprimer la réservation
                if (userId !== null && userId !== dataUserId && userEmail === dataReservation.email) {
                    // On est inscrit / connecté, invité et réservant";
                    reservationLabel = "Réservé par moi";
                }
                reservationTxt.innerText = reservationLabel;
                reservationTxt.appendChild(dltReservationBtn);

                // CAS VISITEUR NON INSCRIT / CONNECTE est sur la carte d'un utilisateur
                // - si l'userId est null et le GuestToken n'est pas lu en URL, il lit "Réservé par ..." et ne peut supprimer la réservation
                if (userId === null && !response.decryptGuestToken) {
                    // On n'est pas connecté ni inscrit, invité, pas réservant";
                    reservationLabel = `Réservé par ${dataReservation.name}`;
                    dltReservationBtn.classList.add("hidden");
                }

                // - si l'userId est null et le GuestToken est lu en URL,
                if (userId === null && response.decryptGuestToken) {
                    const decryptGuestToken = response.decryptGuestToken;
                    // - et si son mail n'est pas celui du réservant, il lit "Réservé par ..." et ne peut supprimer la réservation
                    if (dataReservation.email !== decryptGuestToken.value.email) {
                        // On n'est pas connecté ni inscrit, invité et réservant";
                        reservationLabel = `Réservé par ${dataReservation.name}`;
                        dltReservationBtn.classList.add("hidden");
                    } else {
                        // - sinon il lit "Réservé par moi" et peut supprimer sa réservation
                        reservationLabel = `Réservé par moi`;
                    }
                }
                reservationTxt.innerText = reservationLabel;
                reservationTxt.appendChild(dltReservationBtn);
            }
        }

        // Gestion d'annulation de la réservation
        dltReservationBtn.addEventListener("click", function(e) {
            e.preventDefault();
            const dltBtnResa = parseInt(e.target.value);

            if (dltBtnResa !== objectCard.id) {
                console.warn("pas touche");
                dialog({title: "Erreur", content: "Ne touchez pas à la valeur du bouton."});
                return;

            } else if (confirm('Voulez-vous vraiment vous annuler votre réservation ?') === true) {
                scroll();
                fetchCancelReservation(objectCard.id)
                .then(() => {
                    dialog({title: "Annulation de votre réservation", content: "Votre réservation a bien été annulée."});
                    redirect(`${configPath.basePath}/list/pages/list.html?id=${id}`);
                })
            }
        })
    })
}

export { reservation };