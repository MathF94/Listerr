"use strict";

import {
    fetchCreateCard,
    fetchReadAllCardsByList,
    fetchUpdateCard,
    fetchUpdateReservation,
    fetchDeleteCard,
} from "../../actions/actions_cards.js";

import { CSRFToken } from "../../services/CSRFToken.js";

import {
    configPath,
    redirect,
    dialog,
    scroll,
    validate
} from "../../services/utils.js";

import { displayFormCard } from "./form_card.js";

/**
 * Fonction principale pour gérer les cartes d'une liste.
 */
function card(canCreateCard) {
    // Obtient l'identifiant de la liste à partir des paramètres de l'URL.
    const urlParams = new URLSearchParams(document.location.search);
    const id = urlParams.get("id");
    const oneList = document.querySelector("#oneList");

    const cardDivForm = document.createElement("div");
    cardDivForm.id = "cardSectionForm";
    cardDivForm.classList.add("form");

    const titleForm = document.createElement("h3");
    titleForm.id = "titleFormCard";

    const createCardFormBtn = document.createElement("button");
    createCardFormBtn.id = `cardFormBtn`;
    createCardFormBtn.name = "cardFormBtn";
    createCardFormBtn.type = "button";
    createCardFormBtn.value = `cardFormBtn`;
    createCardFormBtn.classList.add("btn");
    createCardFormBtn.classList.add("way");

    // Affichage du contenu du bouton en fonction du type de liste
    let btnLabel = "Nouveau souhait";
    let checklabel = "Réserver";
    if (localStorage.getItem("typeList") === "TodoList") {
        btnLabel = "Nouvelle tâche";
        checklabel = "Réaliser";
    }

    createCardFormBtn.textContent = "+";
    createCardFormBtn.title = btnLabel;

    const updateProfilList = document.querySelector(`#updateProfilList-${id}`);
    const deleteProfilList = document.querySelector(`#deleteProfilList-${id}`);
    if (updateProfilList) {
        updateProfilList.title = "Modifier une liste";
    }
    if (deleteProfilList) {
        deleteProfilList.title = "Modifier une liste";
    }

    // Affichage du formulaire au click du bouton
    createCardFormBtn.addEventListener("click", function(e) {
        if (createCardFormBtn.value !== "cardFormBtn") {
            return false;
        }

        // Bouton rendu inutilisable
        createCardFormBtn.disabled = true;
        createCardFormBtn.classList.add("disable");
        if (updateProfilList) {
            updateProfilList.disabled = true;
            updateProfilList.classList.remove("edit");
            updateProfilList.classList.add("disableUpdate");
        }
        if (deleteProfilList) {
            deleteProfilList.disabled = true;
            deleteProfilList.classList.remove("delete");
            deleteProfilList.classList.add("disableDelete");
        }

        cardDivForm.appendChild(titleForm);
        // Appel du formulaire de création d'une carte
        displayFormCard(cardDivForm);
        titleForm.innerText = "Formulaire de création d'une carte";
        const cardCancelBtn = document.querySelector("#cardCancelBtn");
        cardCancelBtn.title = "Revenir aux listes";
        const cardForm = document.querySelector("#formCard");

        // Suppression du formulaire d'édition au click du bouton
        cardCancelBtn.addEventListener("click", function() {
            updateProfilList.disabled = false;
            deleteProfilList.disabled = false;
            createCardFormBtn.disabled = false;

            createCardFormBtn.classList.remove("disable");
            createCardFormBtn.classList.add("way");
            updateProfilList.classList.remove("disableUpdate");
            updateProfilList.classList.add("edit");
            deleteProfilList.classList.remove("disableDelete");
            deleteProfilList.classList.add("delete");

            titleFormCard.remove();
            cardForm.remove();
        })

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

            scroll();
            // Création d'une carte
            fetchCreateCard(cardForm, id)
            .then(response => {
                localStorage.removeItem("csrfToken");

                if (response.status === "createCard") {
                    dialog({title: "Et voilà la carte !", content:"à la suivante !"});
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

    if (canCreateCard) {
        oneList.appendChild(cardDivForm);
        cardDivForm.appendChild(createCardFormBtn);
    }

    fetchReadAllCardsByList(id)
    .then(response => {
        if (response.status === "readOneList") {
            const dataCards = response.data.cards;
            const cardArticleContent = document.createElement("article");
            cardArticleContent.id = "cardArticleContent";
            cardArticleContent.classList.add("list");

            const titleCards = document.createElement("h3");
            titleCards.innerText = "Plus en détails";

            cardArticleContent.appendChild(titleCards);

            for (const indexCard in dataCards) {
                const objectCard = dataCards[indexCard];

                const cardSectionContent = document.createElement("section");
                cardSectionContent.id = `cardSectionContent-${objectCard.id}`;
                cardSectionContent.classList.add("card");
                cardSectionContent.classList.add("flex");

                const divStar = document.createElement("div");

                divStar.classList.add("stars");
                const titleH3 = document.createElement("h3");

                const text = document.createElement("p");

                const labelCheck = document.createElement("label");
                labelCheck.for = "checkbox";
                labelCheck.innerText = checklabel;

                const check = document.createElement("input");
                check.id = `checked-${objectCard.id}`;
                check.title = checklabel;
                check.type = "checkbox";
                check.value = objectCard.checked;

                const actionBtn = document.createElement("div");

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

                const priorityValue = objectCard.priority;

                if (check.value === "1") {
                    updateBtnCard.disabled = true;
                    updateBtnCard.classList.remove("edit");
                    updateBtnCard.classList.add("disableUpdate");
                    let checklabel = "Réservé";
                    if (localStorage.getItem("typeList") === "TodoList") {
                        checklabel = "Réalisé";
                    }
                    labelCheck.innerText = checklabel
                    check.title = checklabel;
                }
                // Boucle de création des étoiles (pleines ou vides) en fonction de la priorité
                for (let i = 0 ; i < 5; i++) {
                    const priority = document.createElement("span");
                    priority.classList.add("star");
                    priority.setAttribute("data-star", i+1);
                    priority.textContent = i < priorityValue ? "\u2605" : "\u2606" ;
                    divStar.title = `nombre d'étoiles ${priorityValue}`;
                    divStar.appendChild(priority);
                }

                // Affichage des éléments de la carte
                for (const key in objectCard) {
                    if (key === "title") {
                        titleH3.innerText = `${objectCard.title}`;
                        cardSectionContent.appendChild(titleH3);
                    } else if (key === "updatedAt") {
                        const small = document.createElement("small");
                        small.innerText = `Dernière modification le ${objectCard.updatedAt}`;
                        cardSectionContent.appendChild(small);
                    } else if (key === "checked") {
                        check.checked = objectCard.checked === 1;
                        if(check.checked) {
                            check.disabled = true;
                        }
                        cardSectionContent.appendChild(labelCheck);
                        cardSectionContent.appendChild(check);
                    }

                    if (["id", "listId", "title", "priority", "checked", "createdAt", "updatedAt"].includes(`${key}`)) {
                        continue;
                    }

                    text.innerText = objectCard[key];
                    oneList.after(cardArticleContent);
                    cardArticleContent.appendChild(cardSectionContent);
                    cardSectionContent.appendChild(divStar);
                    cardSectionContent.appendChild(text);
                }

                // Rend visible les boutons pour l'utilisateur courant uniquement
                if (canCreateCard) {
                    cardSectionContent.appendChild(actionBtn);
                    actionBtn.appendChild(updateBtnCard);
                    actionBtn.appendChild(deleteBtnCard);

                    // Désactive le bouton de création de cartes si update de liste en cours
                    updateProfilList?.addEventListener("click", function(e) {
                        e.preventDefault();
                        if (updateProfilList.disabled === true) {
                            createCardFormBtn.disabled = true;
                            createCardFormBtn.classList.remove("way");
                            createCardFormBtn.classList.add("disable");


                            // Réactive le bouton de création de cartes si annulation update de liste
                            cancelForm.addEventListener("click", function(e) {
                                e.preventDefault();
                                if (createCardFormBtn.disabled === true) {
                                    createCardFormBtn.disabled = false
                                    createCardFormBtn.classList.remove("disable");
                                    createCardFormBtn.classList.add("way");
                                }
                            })
                        }
                    })
                }

                // Gestion de la modification d'une carte
                updateBtnCard.addEventListener("click", function(e) {
                    e.preventDefault();
                    const updtBtnCardId = parseInt(e.target.value);
                    if (updtBtnCardId !== objectCard.id) {
                        console.warn("pas touche");
                        return;
                    } else {
                        const updateCardSection = document.createElement("section");
                        updateCardSection.id = `updateCardSection-${objectCard.id}`;
                        updateCardSection.classList.add("updateCard");
                        deleteBtnCard.after(updateCardSection);
                        titleForm.innerText = "Formulaire d'édition d'une carte";
                        updateCardSection.appendChild(titleForm)

                        // Affichage du formulaire d'édition + dissimulation de la carte
                        displayFormCard(updateCardSection);

                        cardSectionContent.classList.add("hidden");

                        updateBtnCard.disabled = true;
                        updateBtnCard.classList.remove("edit");
                        updateBtnCard.classList.add("disableUpdate");

                        deleteBtnCard.disabled = true;
                        deleteBtnCard.classList.remove("delete");
                        deleteBtnCard.classList.add("disableDelete");

                        // Affichage de la carte + suppression du formulaire d'édition
                        const updateFormCard  = document.querySelector("#formCard");
                        const cardCancelBtn = document.querySelector("#cardCancelBtn");
                        cardCancelBtn.addEventListener("click", function() {
                            updateBtnCard.disabled = false;
                            updateBtnCard.classList.add("edit");
                            updateBtnCard.classList.remove("disableUpdate");

                            deleteBtnCard.disabled = false;
                            deleteBtnCard.classList.add("delete");
                            deleteBtnCard.classList.remove("disableDelete");
                            updateFormCard.remove();
                            titleForm.remove();
                            cardSectionContent.classList.remove("hidden");
                        })

                        // Insertion des éléments de la liste dans les inputs
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
                                    dialog({title: "Modification de la carte", content: "Votre carte a bien été mise à jour."});
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

                // Gestion de la réservation d'une carte
                CSRFToken("checkForm");
                check.addEventListener("change", function(e) {
                    objectCard.checked = check.checked === true ? 1 : 0
                    check.value = objectCard.checked
                    scroll();
                    fetchUpdateReservation(objectCard.checked, objectCard.id)
                    .then(response => {
                        localStorage.removeItem("csrfToken");

                        if (response.status === "updateChecked") {
                            dialog({title: "Modification de la réservation", content: "Votre réservation a bien été prise en compte."});
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
                                dialog({title: "Suppression de la carte", content: `<p>Votre carte a bien été supprimée.</p>`});
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