"use strict";

import {
    fetchCreateCard,
    fetchReadAllCardsByList,
    fetchUpdateCard,
    fetchUpdatePriority,
    fetchDeleteCard,
} from "../../actions/actions_cards.js";

import {
    fetchCreateReservation,
    fetchReadAllReservationsByCard,
    fetchCancelReservation,
} from '../../actions/actions_reservation.js'

import { CSRFToken } from "../../services/CSRFToken.js";

import {
    configPath,
    dialog,
    manageBtns,
    scroll,
    redirect,
    type,
    toolTip,
    validate
} from "../../services/utils.js";

import { displayFormCard } from "./form_card.js";

import { displayFormReservation } from "./form_reservation.js";

/**
 * Fonction principale pour gérer les cartes d'une liste.
 */

function card(canCreateCard, updateBtnList, deleteBtnList) {
    // Obtient l'identifiant de la liste à partir des paramètres de l'URL.
    const urlParams = new URLSearchParams(document.location.search);
    const id = urlParams.get("id");
    const oneList = document.querySelector("#oneList");

    // ID de l'utilisateur en cours
    let userId = null;
    if(localStorage.user) {
        userId = JSON.parse(localStorage.user).id;
    }

    // Affichage du contenu du bouton en fonction du type de liste
    let cardFormTitle = "Nouveau souhait";
    let reservationBtnTitle = "Je réserve";
    let reservationBtnTxtContent = "Je réserve";
    if (localStorage.getItem("typeList") === "TodoList") {
        cardFormTitle = "Nouvelle tâche";
        reservationBtnTitle = "Je gère";
        reservationBtnTxtContent = "Je gère";
    }

    // Afficher le title des boutons édition e suppression
    const updateProfilList = document.querySelector(`#updateProfilList-${id}`);
    const deleteProfilList = document.querySelector(`#deleteProfilList-${id}`);
    if (updateProfilList) {
        updateProfilList.title = "Modifier une liste";
    }
    if (deleteProfilList) {
        deleteProfilList.title = "Supprimer une liste";
    }

    // Création des éléments DOM pour le formulaire de création d'une carte
    const cardDivForm = document.createElement("div");
    cardDivForm.id = "cardSectionForm";
    cardDivForm.classList.add("form");
    cardDivForm.classList.add("grid_create_card");

    const titleForm = document.createElement("h3");
    titleForm.id = "titleFormCard";

    const createCardFormBtn = document.createElement("button");
    createCardFormBtn.id = `cardFormBtn`;
    createCardFormBtn.name = "cardFormBtn";
    createCardFormBtn.type = "button";
    createCardFormBtn.value = `cardFormBtn`;
    createCardFormBtn.title = cardFormTitle;
    createCardFormBtn.classList.add("btn");
    createCardFormBtn.classList.add("way");
    createCardFormBtn.textContent = "+";

    // Rappel : "canCreateCard" retourne vrai si utilisateur courant = propriétaire de la liste/carte
    // Si TRUE, l'utilisateur peut créer des "cartes" (souhaits / tâches)
    if (canCreateCard) {
        oneList.appendChild(cardDivForm);
        cardDivForm.appendChild(createCardFormBtn);
    }

    // Affichage du formulaire de création d'une carte au click du bouton
    createCardFormBtn.addEventListener("click", function(e) {
        if (createCardFormBtn.value !== "cardFormBtn") {
            return false;
        }
        // Titre caché
        typeList.classList.add("hidden");

        // Boutons création de carte, édition et suppression de liste cachés
        createCardFormBtn.hidden = true;

        const actionBtnList = document.querySelector("#actionBtnList");
        actionBtnList.classList.add("hidden");

        // Description de liste cachée
        const sectionTxt = document.querySelector("#sectionTxt");
        sectionTxt.classList.add("hidden");

        // Appel du formulaire de création d'une carte
        cardDivForm.style.gridColumn = "1/7";
        cardDivForm.style.gridRow = "1/3";

        cardDivForm.appendChild(titleForm);

        displayFormCard(cardDivForm);
        titleForm.innerText = "Formulaire de création d'une carte";
        const cardCancelBtn = document.querySelector("#cardCancelBtn");
        cardCancelBtn.title = "Revenir aux listes";
        const cardForm = document.querySelector("#formCard");

        // Suppression des éléments du formulaire d'édition au click du bouton "Annuler"
        cardCancelBtn.addEventListener("click", function() {
            // Titre visible
            typeList.classList.remove("hidden");

            // Boutons création de carte, édition et suppression de liste visibles
            createCardFormBtn.hidden = false;
            actionBtnList.classList.remove("hidden");

            // Description de liste visible
            sectionTxt.classList.remove("hidden");

            cardDivForm.style.gridColumn = "5/5";
            cardDivForm.style.gridRow = "2/2";

            titleForm.remove();
            cardForm.remove();
        })

        // Création d'une nouvelle carte (souhait ou tâche)
        CSRFToken(cardForm.id);
        cardForm.addEventListener("submit", function(e) {
            e.preventDefault();
            createCardFormBtn.disabled = false;

            // Validation de pattern du formulaire
            const inputTitle = document.querySelector("#titleCard");
            const inputDescription = document.querySelector("#descriptionCard");
            const inputPriority = document.querySelector("#priority");
            inputTitle.addEventListener("invalid", function(e) {
                validate(e.target)
            });
            inputDescription.addEventListener("invalid", function(e) {
                validate(e.target)
            });
            inputPriority.addEventListener("invalid", function(e) {
                validate(e.target)
            });

            // Retour en haut de page
            scroll();

            fetchCreateCard(cardForm, id)
            .then(response => {
                localStorage.removeItem("csrfToken");

                if (response.status === "createCard") {
                    if (localStorage.getItem("typeList") === "WishList"){
                        dialog({title: "Création du souhait", content: "Votre souhait a bien été créé."});
                    } else {
                        dialog({title: "Création de la tâche", content: "Votre tâche a bien été créée."});
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
    })

    // Affichage des cartes de la liste
    fetchReadAllCardsByList(id)
    .then(response => {
        if (response.status === "readOneList") {
            const dataUserId = response.data.userId;
            const dataCards = response.data.cards;
            const dataType = response.data.type;
            const cardArticleContent = document.createElement("article");

            cardArticleContent.id = "cardArticleContent";
            cardArticleContent.classList.add("list");

            // CSS pour lier la partie supérieure de la liste avec les nouvelles cartes
            if (dataCards.length !== 0) {
                oneList.style.borderRadius = "20px 20px 0 0";
                oneList.style.marginBottom = "0";
                cardArticleContent.style.borderRadius = "0 0 20px 20px";
                cardArticleContent.style.marginTop = "0";
            }

            // CSS pour différencier la couleur de fond des WL ou TL si l'utilisateur est différent du propriétaire
            if (localStorage.getItem("typeList") === "WishList" || localStorage.getItem("typeList") === "TodoList"){
                if(!canCreateCard){
                    cardArticleContent.classList.add("third_party_wish");
                } else{
                    cardArticleContent.classList.add(type[localStorage.getItem("typeList")]);
                }
            }

            // Boucle pour afficher les éléments DOM d'une carte
            for (const indexCard in dataCards) {
                const objectCard = dataCards[indexCard];

                const cardSectionContent = document.createElement("section");
                cardSectionContent.id = `cardSectionContent-${objectCard.id}`;
                cardSectionContent.classList.add("card");
                cardSectionContent.classList.add("grid");

                // CSS pour différencier la couleur des cartes si l'utilisateur est différent du propriétaire ou si c'est une TL
                if((!canCreateCard) || (localStorage.getItem("typeList") === "TodoList")) {
                    cardSectionContent.classList.add("third_party_todo_card");
                } else {
                    cardSectionContent.classList.add("wish");
                }

                const titleH3 = document.createElement("h3");
                titleH3.id = "titleH3";
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

                // Elements DOM pour les boutons d'actions de la carte (Edit/Delete)
                const actionBtnCard = document.createElement("section");
                actionBtnCard.id = `actionBtnCard-${objectCard.id}`;
                actionBtnCard.classList.add("grid_action_btn_lists");

                const updateBtnCard = document.createElement("button");
                updateBtnCard.id = `updateCard-${objectCard.id}`;
                updateBtnCard.name = "updateCard";
                updateBtnCard.title = "Modifier la carte";
                updateBtnCard.type = "submit";
                updateBtnCard.value = objectCard.id;
                updateBtnCard.textContent = "";
                updateBtnCard.classList.add("btn");
                updateBtnCard.classList.add("edit");
                updateBtnCard.classList.add("listBtn");

                const deleteBtnCard = document.createElement("button");
                deleteBtnCard.id = `deleteCard-${objectCard.id}`;
                deleteBtnCard.name = "deleteCard";
                deleteBtnCard.title = "Supprimer la carte";
                deleteBtnCard.type = "button";
                deleteBtnCard.value = objectCard.id;
                deleteBtnCard.textContent = "";
                deleteBtnCard.classList.add("btn");
                deleteBtnCard.classList.add("delete");
                deleteBtnCard.classList.add("listBtn");

                cardSectionContent.appendChild(reservationBtn);

                // Boutons réservation, priorités, édition et suppression des cartes cachés
                createCardFormBtn.addEventListener("click", function (e) {
                    e.preventDefault();

                    manageBtns(createCardFormBtn, cardCancelBtn,'.edit', 'disableUpdate', 'edit');
                    manageBtns(createCardFormBtn, cardCancelBtn,'.delete', 'disableDelete', 'delete');
                    manageBtns(createCardFormBtn, cardCancelBtn,'.stars', 'disable_stars', 'stars');
                    manageBtns(createCardFormBtn, cardCancelBtn,'.reservation', 'cancel', 'reservation');
                })

                // Affichage des données de la carte
                for (const key in objectCard) {
                    if (key === "title") {
                        titleH3.innerText = `${objectCard.title}`;
                        cardSectionContent.appendChild(titleH3);
                    } else if (key === "updatedAt") {
                        toolTip(cardSectionContent, objectCard.id, objectCard.updatedAt, response.data.user.login)
                    }

                    if (["id", "listId", "title", "priority", "reservationId", "login", "createdAt", "updatedAt"].includes(`${key}`)) {
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
                    actionBtnCard.appendChild(updateBtnCard);
                    actionBtnCard.appendChild(deleteBtnCard);
                }

                // Rend les boutons d'actions des cartes inutilisables pour l'utilisateur courant uniquement
                if (canCreateCard) {
                    cardSectionContent.appendChild(actionBtnCard);

                    // Désactive le bouton de création, édition et suppression de cartes si update de liste en cours
                    updateProfilList?.addEventListener("click", function(e) {
                        e.preventDefault();
                        if (updateProfilList.hidden === true) {
                            updateBtnCard.classList.add("disableUpdate");
                            updateBtnCard.classList.remove("edit")
                            updateBtnCard.disabled = true;
                            deleteBtnCard.classList.add("disableDelete");
                            deleteBtnCard.classList.remove("delete")
                            deleteBtnCard.disabled = true;

                            // Réactive le bouton de création de cartes si annulation update de liste
                            cancelForm.addEventListener("click", function(e) {
                                e.preventDefault();
                                if (createCardFormBtn.hidden === false) {
                                    updateBtnCard.classList.remove("disableUpdate");
                                    updateBtnCard.classList.add("edit");
                                    updateBtnCard.disabled = false;
                                    deleteBtnCard.classList.remove("disableDelete");
                                    deleteBtnCard.classList.add("delete");
                                    deleteBtnCard.disabled = false;
                                }
                            })
                        }
                    })
                }

                // Gestion de la modification d'une carte
                updateBtnCard.addEventListener("click", function(e) {
                    e.preventDefault();

                    // Sécurité pour permettre la modification => Value bouton = ID de la carte
                    const updtBtnCardId = parseInt(e.target.value);

                    if (updtBtnCardId !== objectCard.id) {
                        console.warn("pas touche");
                        dialog({title: "Erreur", content: "Ne touchez pas à la valeur du bouton."});
                        return;

                    } else {
                        const updateCardSection = document.createElement("section");
                        const cardFormBtn = document.querySelector("#cardFormBtn");
                        titleForm.innerText = "Formulaire d'édition d'une carte";
                        titleForm.classList.add("width");
                        reservationBtn.style.width = "105px";

                        // Gestion des boutons de la carte courante à modifier
                        // Bouton de création de cartes inutilisable
                        cardFormBtn.classList.add("disable");
                        cardFormBtn.disabled = true;

                        // Boutons édition et suppression des listes inutilisables
                        updateBtnList.classList.add("disableUpdate");
                        updateBtnList.classList.remove("edit");
                        updateBtnList.disabled = true;
                        deleteBtnList.classList.add("disableDelete");
                        deleteBtnList.classList.remove("delete");
                        deleteBtnList.disabled = true;

                        // Boutons édition et suppression des cartes cachés
                        updateBtnCard.hidden = true;
                        deleteBtnCard.hidden = true;

                        // Réservation cachée
                        reservationBtn.hidden = true;

                        // Etoiles de priorité cachées
                        divStar.classList.add("hidden");

                        updateCardSection.id = `updateCardSection-${objectCard.id}`;
                        updateCardSection.classList.add("updateCard");
                        actionBtnCard.classList.remove("grid_action_btn_lists");
                        actionBtnCard.classList.add("grid_edit_card");
                        deleteBtnCard.after(updateCardSection);
                        updateCardSection.appendChild(titleForm)

                        // Affichage du formulaire d'édition + dissimulation de la carte
                        displayFormCard(updateCardSection);

                        cardSectionContent.classList.add("hidden");

                        // Affichage de la carte + suppression du formulaire d'édition
                        const updateFormCard  = document.querySelector("#formCard");
                        const cardCancelBtn = document.querySelector("#cardCancelBtn");

                        // Boutons réservation, priorités, édition et suppression des autres cartes cachés
                        manageBtns(updateBtnCard, cardCancelBtn,'.edit', 'disableUpdate', 'edit');
                        manageBtns(updateBtnCard, cardCancelBtn,'.delete', 'disableDelete', 'delete');
                        manageBtns(updateBtnCard, cardCancelBtn,'.stars', 'disable_stars', 'stars');
                        manageBtns(updateBtnCard, cardCancelBtn,'.reservation', 'cancel', 'reservation');

                        cardCancelBtn.addEventListener("click", function() {
                            reservationBtn.removeAttribute("style");

                            // Gestion des boutons de la carte courante à modifier
                            // Bouton de création de cartes utilisable
                            cardFormBtn.classList.remove("disable");
                            cardFormBtn.disabled = false;

                            // Boutons édition et suppression des listes utilisables
                            updateBtnList.classList.remove("disableUpdate");
                            updateBtnList.classList.add("edit");
                            updateBtnList.disabled = false;

                            deleteBtnList.classList.remove("disableDelete");
                            deleteBtnList.classList.add("delete");
                            deleteBtnList.disabled = false;

                            // Boutons édition et suppression des cartes réapparus
                            updateBtnCard.hidden = false;
                            deleteBtnCard.hidden = false;

                            // Réservation cachée
                            reservationBtn.hidden = false;

                            // Etoiles de priorité visibles
                            divStar.classList.remove("hidden");

                            actionBtnCard.classList.remove("grid_edit_card");
                            actionBtnCard.classList.add("grid_action_btn_lists");

                            // Retrait titre et formulaire édition de cartes
                            titleForm.remove();
                            updateFormCard.remove();
                            cardSectionContent.classList.remove("hidden");
                        })

                        // Insertion des éléments de la carte dans les inputs
                        const inputTitle = document.querySelector("#titleCard");
                        inputTitle.value = objectCard.title;

                        const inputDescription = document.querySelector("#descriptionCard");
                        inputDescription.value = objectCard.description;

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
                                    if (localStorage.getItem("typeList") === "WishList"){
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
                })

                // Gestion de la réservation d'un souhait / tâche
                // Renvoi à la connexion si invité non connecté souhaite réserver
                if (localStorage.token === undefined || localStorage.token === null || localStorage.user === null || localStorage.user === undefined) {
                    reservationBtn.addEventListener("click", function (e) {
                        dialog({
                            title: "Vous n'êtes pas encore connecté ?",
                            content: "Vous allez être redirigé(e) vers la page de connexion"
                        });
                        const dialogMsg = document.querySelector("dialog");
                        dialogMsg.classList.add("home");
                        redirect(`${configPath.basePath}/user/pages/login.html?redirection=list&id=${id}`);
                    })

                } else {
                    // Affichage du formulaire pour réserver
                    reservationBtn.addEventListener("click", function(e) {
                        e.preventDefault();
                        displayFormReservation(cardSectionContent)

                        // Clique pour fermer le formulaire de réservation
                        guestCancelBtn.addEventListener("click", function() {
                            formGuest.remove();
                        })

                        CSRFToken(formGuest.id);
                        formGuest.addEventListener("submit", function(e) {
                            e.preventDefault();
                            reservationBtn.disabled = false;
                            // Validation de pattern du formulaire
                            const inputLogin = document.querySelector("#guestName");
                            inputLogin.addEventListener("invalid", function(e) {
                                validate(e.target)
                            });

                            scroll();
                            fetchCreateReservation(formGuest, objectCard.id)
                            .then(response => {
                                localStorage.removeItem("csrfToken");

                                // rendre tous les boutons actions inutilisables et/ou invisible

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
                    })
                }

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
                        if((!canCreateCard) || (dataType === "TodoList")) {
                            priority.classList.add("third_party_stars");
                        } else {
                            priority.classList.add("stars");
                        }

                        priority.setAttribute("data-star", i+1);
                        priority.textContent = i < priorityValue ? "\u2605" : "\u2606" ;
                        divStar.title = `nombre d'étoiles ${priorityValue}`;
                        divStar.appendChild(priority);

                        if (response.status === 'in pending reservation') {
                            reservationTxt.remove();
                            // Si l'utilisateur courant n'est pas le proprio de la carte, alors il ne peut pas modifier la priorité
                            if(!canCreateCard) {
                                priority.classList.remove("stars");
                                priority.classList.add("disable_stars");
                            }

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

                            function updatePriority(e) {
                                fetchUpdatePriority(e.target.dataset.star, objectCard.id)
                                .then(response => {
                                    if (response.status === "updatePriority") {
                                        if (localStorage.getItem("typeList") === "WishList"){
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

                        if (response.status === "readOneReservation") {
                            const dataReservation = response.dataReservation;
                            priority.classList.remove("stars");
                            priority.classList.add("disable_stars");

                            updateBtnCard.disabled = true;
                            updateBtnCard.classList.remove("edit");
                            updateBtnCard.classList.add("disableUpdate");

                            // CSS pour modifier le bouton de réservation et texte
                            // Si une réservation est faite, le bouton disparaît
                            reservationBtn.remove();

                            // Si réservation est faite par qqun d'autre que l'utilisateur courant sur la carte de l'utilisateur courant
                            // on dissimule le/la réservant(e) par le message "Réservé"

                            let reservationLabel = `Réservé par ${dataReservation.login}`;

                            if (userId !== dataReservation.userId && userId === parseInt(localStorage.userList)) {
                                reservationLabel = "Réservé"
                                dltReservationBtn.classList.add("hidden");
                            }

                            if (localStorage.getItem("typeList") === "TodoList") {
                                reservationLabel = `En cours par ${dataReservation.login}`;
                            }

                            reservationTxt.innerText = reservationLabel;

                            if (userId === dataReservation.userId) {
                                reservationTxt.appendChild(dltReservationBtn);
                            }
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

                // Gestion de la suppression de carte
                deleteBtnCard.addEventListener("click", function(e) {
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
                                if (localStorage.getItem("typeList") === "WishList"){
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
                })
            }
        }
    })
}

export { card };