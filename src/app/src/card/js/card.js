"use strict";

import { displayFormCard } from "./form_card.js";

import { displayFormReservation } from "./form_reservation.js";

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
    fetchCancelReservation
} from '../../actions/actions_reservation.js'

import { dropDownMenu } from "../../layout/dropdown.js";

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

    // Création d'une carte au click du bouton
    createCardFormBtn.addEventListener("click", function(e) {
        if (createCardFormBtn.value !== "cardFormBtn") {
            return false;
        }
        const createCardDiv = document.createElement("div");
        createCardDiv.id = "createCardDiv";
        // Boutons création de carte caché et popIn visible
        createCardFormBtn.hidden = true;
        popIn.style.visibility = "visible";

        popIn.appendChild(createCardDiv);
        // Affichage du formulaire de création d'une carte
        displayFormCard(createCardDiv);
        const cardForm = document.querySelector("#formCard");
        const titleFormCard = document.querySelector("#titleFormCard");
        titleFormCard.innerText = "Formulaire de création de la carte";

        // Suppression des éléments du formulaire d'édition au click du bouton "Annuler"
        cardCancelBtn.addEventListener("click", function() {
            // Boutons création de carte visible et popIn cachée
            createCardFormBtn.hidden = false;
            popIn.style.visibility = "hidden";
            cardForm.remove();
            createCardDiv.remove();
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
                    if (localStorage.getItem("userTypeList") === "WishList") {
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

                // Boutons réservation, priorités, édition et suppression des cartes cachés
                createCardFormBtn.addEventListener("click", function (e) {
                    e.preventDefault();
                    manageBtns('.reservation', 'disable', 'reservation', cardCancelBtn)
                    manageBtns('.stars', 'disableStars', 'stars', cardCancelBtn)
                })

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

                                        // Bouton de création de cartes inutilisable
                                        cardFormBtn.classList.add("disable");
                                        cardFormBtn.disabled = true;

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
                                            cardFormBtn.classList.remove("disable");
                                            cardFormBtn.disabled = false;
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

                /**
                 * ______________________________________________________________________________________________________________
                 * Gestion de la réservation d'un souhait / tâche d'une carte dans une liste
                 * ______________________________________________________________________________________________________________
                 */
                reservationBtn.addEventListener("click", function(e) {
                    e.preventDefault();
                    const updateReservationDiv = document.createElement("div");
                    updateReservationDiv.id = "updateReservationDiv";
                    popIn.style.visibility = "visible";

                    popIn.appendChild(updateReservationDiv);

                    // Affichage du formulaire pour réserver
                    displayFormReservation(updateReservationDiv);
                    // Réservation cachée
                    // reservationBtn.hidden = true;
                    // Etoiles de priorité cachées
                    // divStar.classList.add("hidden");
                    // Description cachée
                    // text.classList.add("hidden");

                    const inputLogin = document.querySelector("#name");
                    const inputMail = document.querySelector("#email");
                    inputLogin.value = userLogin;
                    inputMail.value = userEmail;

                    // Si invité n'a pas de compte, il peut quand même réserver
                    if (localStorage.user === null || localStorage.user === undefined || localStorage.token === null || localStorage.token === undefined) {
                        guestCancelBtn.addEventListener("click", function() {
                            popIn.style.visibility = "hidden";
                            updateReservationDiv.remove();
                            // formGuest.remove();
                            // Réservation cachée
                            // reservationBtn.hidden = false;
                            // Etoiles de priorité visibles
                            // divStar.classList.remove("hidden");
                            // Description visible
                            // text.classList.remove("hidden");
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
                            // formGuest.remove();
                            // Réservation cachée
                            // reservationBtn.hidden = false;
                            // Etoiles de priorité visibles
                            // divStar.classList.remove("hidden");
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
                        // Bouton de création de cartes inutilisable
                        cardFormBtn.classList.add("disable");
                        cardFormBtn.disabled = true;

                        guestCancelBtn.addEventListener("click", function() {
                            popIn.style.visibility = "hidden";
                            updateReservationDiv.remove();
                            // formGuest.remove();
                            // Bouton de création de cartes utilisable
                            cardFormBtn.classList.remove("disable");
                            cardFormBtn.disabled = false;

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

                        // En attente de réservation
                        if (response.status === 'in pending reservation') {
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
                        if (response.status === "readOneReservation") {
                            const dataReservation = response.dataReservation;

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
        }
    })
}

export { card };