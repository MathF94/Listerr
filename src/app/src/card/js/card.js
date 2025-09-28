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

import { fetchReadAll } from '../../actions/actions_admin.js'

import {
    fetchReadAllCardsByList,
    fetchUpdateCard,
    fetchDeleteCard,
} from "../../actions/actions_cards.js";

import { fetchSendMailCard } from '../../actions/actions_mails.js'

import { dropDownMenu } from "../../layout/dropdown.js";

import { reservation } from "../../reservation/js/reservation.js";

import { CSRFToken } from "../../services/CSRFToken.js";

import { displayFormCard } from "../../services/form_card.js";

import { displayFormMail } from '../../services/form_mail.js';

import {
    allowedIds,
    configPath,
    createOptionLoginMail,
    detail,
    dialog,
    manageBtns,
    redirect,
    scroll,
    type
} from "../../services/utils.js";

/**
 * Fonction principale pour gérer les cartes d'une liste.
 */

function card(canCreateCard) {
    // Obtient l'identifiant de la liste à partir des paramètres de l'URL.
    const urlParams = new URLSearchParams(document.location.search);
    const id = urlParams.get("id");
    const oneList = document.querySelector("#oneList");

    // ID de l'utilisateur en cours
    let userId = null;
    let userLogin = null;
    let userEmail = null;

    if (localStorage.user) {
        userId = JSON.parse(localStorage.user).id;
        userLogin = JSON.parse(localStorage.user).login;
        userEmail = JSON.parse(localStorage.user).email;
    }

    // Affichage du contenu du bouton en fonction du type de liste
    let cardFormTitle = "Nouveau souhait";
    let reservationBtnTitle = "Je réserve";
    let reservationBtnTxtContent = "Je réserve";

    if (localStorage.getItem("userTypeList") === "TodoList") {
        cardFormTitle = "Nouvelle tâche";
        reservationBtnTitle = "Je gère";
        reservationBtnTxtContent = "Je gère";
    }

    const updateProfilList = document.querySelector(`#updateList-${id}`);

    const popIn = document.querySelector("#popIn");

    // Affichage des cartes de la liste
    fetchReadAllCardsByList(id)
    .then(response => {
        if (response?.status === "readOneList") {

            const dataUserId = response.data.user.id;
            const dataUserEmail = response.data.user.email
            const dataType = response.data.type;
            const dataListTitle = response.data.title;
            const dataCards = response.data.cards;
            const dataListID = response.data.id;

            const cardArticleContent = document.createElement("article");
            cardArticleContent.id = "cardArticleContent";
            cardArticleContent.classList.add("list");
            cardArticleContent.classList.add("wish");

            const sendMailCardBtn = document.createElement("button");
            sendMailCardBtn.id = 'sendMailCardBtn';
            sendMailCardBtn.type = 'button';
            sendMailCardBtn.innerText = '✉ Mail';
            sendMailCardBtn.title = 'Envoyer un mail aux membres de Listerr';
            sendMailCardBtn.classList.add('btn');
            sendMailCardBtn.classList.add('way');
            sendMailCardBtn.classList.add('grid_send_mail');

            sendMailCardBtn.addEventListener('click', function (e) {
                e.preventDefault();
                const createMailCardDiv = document.createElement("div");
                createMailCardDiv.id = "createMailCardDiv";
                popIn.style.visibility = "visible";

                popIn.appendChild(createMailCardDiv);

                displayFormMail(createMailCardDiv);
                const titleMail = document.querySelector('#titleMail');
                titleMail.innerText = `Paramètres du mail d'information d'ajout de souhait(s)`;

                const recipientsList = document.querySelector('#recipientsList');
                recipientsList.innerText = "destinataire vide";
                recipientsList.classList.add("italic");

                const inputObjectMail = document.querySelector('#inputObjectMail');
                inputObjectMail.value = `${dataListTitle} - Nouveau(x) souhait(s)`;

                const textAreaMail = document.querySelector('#descriptionMail');
                textAreaMail.placeholder = `Description courte de l'ajout de souhait(s) \n "Dernière(s) envie(s) : nom du souhait n° 1, nom du souhait n° 2, etc."`;

                recipientsLists.remove()

                fetchReadAll()
                .then((response) => {
                    const dataUsers = response.usersList
                    const recipientsListDiv = document.querySelector('#recipientsListDiv');
                    const recipientsList = document.querySelector('#recipientsList');

                    const trashMailBtn = document.createElement('button');
                    trashMailBtn.id = 'trashMailBtn';
                    trashMailBtn.type = 'button';
                    trashMailBtn.innerText = '';
                    trashMailBtn.classList.add('btn');
                    trashMailBtn.classList.add('delete');

                    let option = '';
                    const arrayRecipients = [];
                    dataUsers.forEach(dataUser => {
                        const allUsersLogin = dataUser.login;
                        const allUsersId = dataUser.id;
                        const allUsersEmail = dataUser.email;

                        option = createOptionLoginMail(allUsersId, allUsersLogin, allUsersEmail)
                        const selectRecipients = document.querySelector('#recipients');
                        selectRecipients.appendChild(option);
                    });

                    const validLoginBtn = document.querySelector('#validLoginBtn');
                    validLoginBtn.addEventListener('click', function (e) {
                        e.preventDefault();
                        const emailUser = recipients.value
                        recipientsListDiv.appendChild(trashMailBtn);

                        if (!arrayRecipients.includes(emailUser)) {
                            arrayRecipients.push(emailUser);
                        }
                        // Complète la partie "Destinataire(s) retenu(es)"
                        recipientsList.classList.remove('italic');
                        recipientsList.innerText = arrayRecipients.join(', ');
                        // Complète l'input hidden pour le formulaire
                        inputRecipients.value =  JSON.stringify(arrayRecipients);
                    })

                    // Supprime les emails en cas d'erreur d'insertion
                    trashMailBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        inputRecipients.innerText = 'destinataire vide';

                        arrayRecipients.length = 0;
                        if (recipientsList) {
                            recipientsList.innerText = 'destinataire vide';
                            recipientsList.classList.add('italic');
                        }
                        trashMailBtn.remove();
                    })

                    CSRFToken(mailForm.id);
                    mailForm.addEventListener('submit', function(e) {
                        e.preventDefault();
                        // Validation de pattern du formulaire
                        const inputRecipients = document.querySelector('#inputRecipients');
                        const inputObjectMail = document.querySelector('#inputObjectMail');
                        const textAreaMail = document.querySelector('#descriptionMail');
                        inputRecipients.addEventListener('invalid', function(e) {
                            validate(e.target)
                        });
                        inputObjectMail.addEventListener('invalid', function(e) {
                            validate(e.target)
                        });
                        textAreaMail.addEventListener('invalid', function(e) {
                            validate(e.target)
                        });

                        fetchSendMailCard(mailForm, dataListID)
                        .then(response => {
                            localStorage.removeItem('csrfToken');

                            if (response.status === 'sendMail') {
                                dialog({title: 'Envoi de mail', content: `Le mail d'informations a bien été envoyé`});
                                const dialogMsg = document.querySelector('dialog');
                                dialogMsg.classList.add('valid');
                                redirect(`${configPath.basePath}/list/pages/list.html?id=${id}`, 3000);
                            }

                            if (response.status === 'errors') {
                                dialog({title: 'Erreurs', content: response.errors});
                                const dialogMsg = document.querySelector('dialog');
                                dialogMsg.classList.add('errors');
                                redirect(`${configPath.basePath}/list/pages/list.html?id=${id}.html`);
                            };
                        })
                    })

                    sendMailCardBtn.disabled = true;
                    sendMailCardBtn.classList.remove('way');
                    sendMailCardBtn.classList.add('disable');

                    cancelForm.addEventListener('click', function(e) {
                        e.preventDefault();
                        createMailCardDiv.remove();
                        sendMailCardBtn.disabled = false;
                        sendMailCardBtn.classList.remove('disable');
                        sendMailCardBtn.classList.add('way');

                        popIn.style.visibility = 'hidden';
                    })
                })
            })

            // CSS pour lier la partie supérieure de la liste avec les nouvelles cartes
            if (dataCards.length !== 0) {
                oneList.style.borderRadius = "20px 20px 0 0";
                oneList.style.marginBottom = "0";
                cardArticleContent.style.borderRadius = "0 0 20px 20px";
                cardArticleContent.style.marginTop = "0";

                if (canCreateCard){
                    if (dataType !== "TodoList") {
                        oneList.appendChild(sendMailCardBtn);
                    }
                }
            }

            // CSS pour différencier la couleur de fond des WL ou TL si l'utilisateur est différent du propriétaire
            if (localStorage.getItem("userTypeList") === "WishList" || localStorage.getItem("userTypeList") === "TodoList") {
                if (!canCreateCard) {
                    cardArticleContent.classList.add("third_party_wish");
                } else {
                    cardArticleContent.classList.add(type[localStorage.getItem("userTypeList")]);
                }
            }

            // Boucle pour afficher les éléments DOM d'une carte
            for (const indexCard in dataCards) {
                const objectCard = dataCards[indexCard];

                const cardSectionContent = document.createElement("div");
                cardSectionContent.id = `cardSectionContent-${objectCard.id}`;
                cardSectionContent.classList.add("card");
                cardSectionContent.classList.add("grid");

                // CSS pour différencier la couleur des cartes si l'utilisateur est différent du propriétaire ou si c'est une TL
                if ((!canCreateCard) || (localStorage.getItem("userTypeList") === "TodoList")) {
                    cardSectionContent.classList.add("third_party_todo_card");
                } else {
                    cardSectionContent.classList.add("wish");
                }

                const titleH3 = document.createElement("h3");
                titleH3.id = `title-${objectCard.id}`;
                titleH3.classList.add("grid_titleH3_card")

                const text = document.createElement("p");
                text.classList.add("grid_text_card");
                text.classList.add("dot");

                // Elements DOM pour les étoiles
                const divStar = document.createElement("div");
                divStar.id = `divStar-${objectCard.id}`;
                divStar.classList.add("grid_stars");

                // Elements DOM pour la réservation
                const reservationTxt = document.createElement("p");
                reservationTxt.classList.add("grid_text_reserved");

                const reservationBtn = document.createElement("button");
                reservationBtn.id = `reservationBtn-${objectCard.id}`
                reservationBtn.name = "reservationBtn"
                reservationBtn.title = "Je réserve"
                reservationBtn.textContent = "Je réserve"
                reservationBtn.title = reservationBtnTitle
                reservationBtn.textContent = reservationBtnTxtContent
                reservationBtn.type = "button"
                reservationBtn.value = objectCard.id;
                reservationBtn.classList.add("btn");
                reservationBtn.classList.add("listBtn");
                reservationBtn.classList.add("reservation");
                reservationBtn.classList.add("grid_reservation_btn");

                const dltReservationBtn = document.createElement("button");
                dltReservationBtn.id = `dltReservationBtn-${objectCard.id}`
                dltReservationBtn.name = "dltReservationBtn"
                dltReservationBtn.title = "Annuler la réservation"
                dltReservationBtn.value = objectCard.id;
                dltReservationBtn.type = "button"
                dltReservationBtn.textContent = ""
                dltReservationBtn.classList.add("btn");
                dltReservationBtn.classList.add("delete");
                dltReservationBtn.classList.add("reservation");

                cardSectionContent.appendChild(reservationBtn);

                // Affichage des données de la carte
                for (const key in objectCard) {
                    if (key === "title") {
                        titleH3.innerText = `${objectCard.title}`;
                        cardSectionContent.appendChild(titleH3);
                    } else if (key === "updatedAt") {
                        // Informations importées dans le menu des cartes
                        const actions = [
                            {
                                id: `detailCard-${objectCard.id}`,
                                text : detail(objectCard.updatedAt, response.data.user.login),
                                onclick: false
                            },
                            {
                                // Gestion de la modification d'une carte
                                id: `updateCard-${objectCard.id}`,
                                text: "🖊 Modifier la carte",
                                onclick: function(e) {
                                    e.preventDefault();
                                    // Sécurité pour permettre la modification => Value bouton = ID de la carte
                                    const updtBtnCardId = parseInt(e.target.value);

                                    if (updtBtnCardId !== objectCard.id) {
                                        console.warn("pas touche");
                                        dialog({title: "Erreur", content: "Ne touchez pas à la valeur du bouton."});
                                        return;

                                    } else {
                                        const updateCardDiv = document.createElement("div");
                                        updateCardDiv.id = `updateCardDiv-${objectCard.id}`;
                                        updateCardDiv.classList.add("updateCardDiv");
                                        popIn.style.visibility = "visible";

                                        const dropDown = document.querySelector(`#dropDown-${objectCard.id}`)
                                        dropDown.classList.remove('show__more__menu');

                                        popIn.appendChild(updateCardDiv)

                                        // Affichage du formulaire d'édition + dissimulation de la carte
                                        displayFormCard(updateCardDiv);
                                        // cardSectionContent.classList.add("hidden");
                                        const titleFormCard = document.querySelector("#titleFormCard");
                                        titleFormCard.innerText = "Formulaire d'édition de la carte";

                                        // Affichage de la carte + suppression du formulaire d'édition
                                        const updateFormCard  = document.querySelector("#formCard");
                                        const cardCancelBtn = document.querySelector("#cardCancelBtn");

                                        cardCancelBtn.addEventListener("click", function() {
                                            popIn.style.visibility = "hidden";

                                            // Bouton de création de cartes utilisable
                                            updateCardDiv.remove();
                                            cardSectionContent.classList.remove("hidden");
                                        })

                                        // Boutons réservation, priorités, édition et suppression des autres cartes cachés
                                        manageBtns('.reservation', 'disable', 'reservation', cardCancelBtn)
                                        manageBtns('.stars', 'disableStars', 'stars', cardCancelBtn)

                                        // Insertion des éléments de la carte dans les inputs
                                        const inputTitle = document.querySelector("#titleCard");
                                        inputTitle.value = objectCard.title;

                                        const textAreaDescription = document.querySelector("#descriptionCard");
                                        textAreaDescription.value = objectCard.description;

                                        const inputPriority = document.querySelector("#priority");
                                        inputPriority.value = objectCard.priority;

                                        CSRFToken(updateFormCard.id);
                                        updateFormCard.addEventListener("submit", function(e) {
                                            e.preventDefault();
                                            scroll();
                                            fetchUpdateCard(updateFormCard, objectCard.id)
                                            .then(response => {
                                                localStorage.removeItem("csrfToken");

                                                if (response.status === "updateCard") {
                                                    if (localStorage.getItem("userTypeList") === "WishList") {
                                                        dialog({title: "Modification du souhait", content: "Votre souhait a bien été mis à jour."});
                                                    } else {
                                                        dialog({title: "Modification de la tâche", content: "Votre tâche a bien été mise à jour."});
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
                                        })
                                    }
                                }
                            },
                            {
                                // Gestion de la suppression de carte
                                id: `deleteCard-${objectCard.id}`,
                                text: "🗑 Supprimer la carte",
                                onclick: function(e) {
                                    e.preventDefault();
                                    const dltBtnCardId = parseInt(e.target.value);

                                    if (dltBtnCardId !== objectCard.id) {
                                        console.warn("pas touche");
                                        return;
                                    } else if (confirm('Voulez-vous vraiment vous supprimer la carte ?') === true) {
                                        scroll();
                                        fetchDeleteCard(objectCard.id)
                                        .then((response) => {
                                            if (response.status === "deleteCard") {
                                                if (localStorage.getItem("userTypeList") === "WishList") {
                                                    dialog({title: "Suppression du souhait", content: "Votre souhait a bien été supprimé."});
                                                } else {
                                                    dialog({title: "Suppression de la tâche", content: "Votre tâche a bien été supprimée."});
                                                }
                                                const dialogMsg = document.querySelector("dialog");
                                                dialogMsg.classList.add("valid");
                                                redirect(`${configPath.basePath}/list/pages/list.html?id=${id}`);
                                            }
                                        })
                                    }
                                }
                            },
                            {
                                // Gestion du partage de la carte
                                id: `shareCard-${objectCard.id}`,
                                text: "🔗 Partager la carte",
                                onclick: function(e) {
                                    e.preventDefault();
                                    const sharedURL = window.location.href;
                                    navigator.clipboard.writeText(sharedURL);
                                    dialog({title: "Copié dans le presse-papier", content: "Votre souhait a bien été copié."});
                                    const dialogMsg = document.querySelector("dialog");
                                    dialogMsg.classList.add("valid");
                                    redirect(`${configPath.basePath}/list/pages/list.html?id=${id}`);
                                }
                            }
                        ]
                        dropDownMenu(cardSectionContent, objectCard.id, objectCard.updatedAt, response.data.user.login, actions);
                    }

                    if (allowedIds.includes(`${key}`)) {
                        continue;
                    }

                    let textUrl = objectCard[key]

                    function urlify1(textUrl) {
                        const urlRegex = /(https?:\/\/[^\s]+)/g;
                        return textUrl.replace(urlRegex, function(url) {
                            return '<a title= ' + url + ' href="' + url +'">' + "lien vers la description" + '</a>'
                        })
                    }
                    let html = urlify1(textUrl)

                    text.innerHTML = html;

                    oneList.after(cardArticleContent);
                    cardArticleContent.appendChild(cardSectionContent);
                    cardSectionContent.appendChild(text);
                    cardSectionContent.appendChild(reservationTxt);
                    cardSectionContent.appendChild(divStar);
                }

                // Rend les boutons d'actions des cartes inutilisables pour l'utilisateur courant uniquement
                // Si modification de liste en cours, désactive le bouton de création, de réservation et la priorité des cartes
                if (canCreateCard) {
                    updateProfilList?.addEventListener("click", function(e) {
                        e.preventDefault();
                        manageBtns('.reservation', 'disable', 'reservation', cancelForm)
                        manageBtns('.stars', 'disableStars', 'stars', cancelForm)
                        manageBtns('.delete', 'disableDelete', 'delete', cancelForm)
                    })
                }

                reservation(
                    id,
                    response,
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
                );
            }
        }
    })
}

export { card };