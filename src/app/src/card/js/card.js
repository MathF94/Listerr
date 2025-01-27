"use strict";

import { displayFormCard } from "./form_card.js";

import {
    fetchReadAllCardsByList,
    fetchUpdateCard,
    fetchDeleteCard,
} from "../../actions/actions_cards.js";

import { dropDownMenu } from "../../layout/dropdown.js";

import { reservation } from "../../reservation/js/reservation.js";

import { CSRFToken } from "../../services/CSRFToken.js";

import {
    allowedIds,
    configPath,
    detail,
    dialog,
    manageBtns,
    redirect,
    scroll,
    type,
    validate
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

    // Création des éléments DOM pour le formulaire de création d'une carte
    const cardDivForm = document.createElement("div");
    cardDivForm.id = "cardDivForm";
    cardDivForm.classList.add("form");
    cardDivForm.classList.add("grid_create_card");

    const popIn = document.querySelector("#popIn");

    // Rappel : "canCreateCard" retourne vrai si utilisateur courant = propriétaire de la liste/carte
    // Si TRUE, l'utilisateur peut créer des "cartes" (souhaits / tâches)
    if (canCreateCard) {
        oneList.appendChild(cardDivForm);
    }

    // Affichage des cartes de la liste
    fetchReadAllCardsByList(id)
    .then(response => {
        if (response?.status === "readOneList") {

            const dataUserId = response.data.user.id;
            const dataUserEmail = response.data.user.email
            const dataType = response.data.type;
            const dataCards = response.data.cards;

            const cardArticleContent = document.createElement("article");
            cardArticleContent.id = "cardArticleContent";
            cardArticleContent.classList.add("list");
            cardArticleContent.classList.add("wish");

            // CSS pour lier la partie supérieure de la liste avec les nouvelles cartes
            if (dataCards.length !== 0) {
                oneList.style.borderRadius = "20px 20px 0 0";
                oneList.style.marginBottom = "0";
                cardArticleContent.style.borderRadius = "0 0 20px 20px";
                cardArticleContent.style.marginTop = "0";
            }

            // CSS pour différencier la couleur de fond des WL ou TL si l'utilisateur est différent du propriétaire
            if (localStorage.getItem("userTypeList") === "WishList" || localStorage.getItem("userTypeList") === "TodoList") {
                if (!canCreateCard) {
                    cardArticleContent.classList.add("third_party_wish");
                } else{
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
                                text: "Modifier la carte",
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
                                text: "Supprimer la carte",
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