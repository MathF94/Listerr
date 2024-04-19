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
    type,
    redirect,
    dialog,
    toolTip,
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
    let userId = null;

    if(localStorage.user) {
        userId = JSON.parse(localStorage.user).id;
    }

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
        deleteProfilList.title = "Supprimer une liste";
    }

    // Affichage du formulaire au click du bouton
    createCardFormBtn.addEventListener("click", function(e) {
        if (createCardFormBtn.value !== "cardFormBtn") {
            return false;
        }

        // Bouton rendu inutilisable
        createCardFormBtn.disabled = true;
        createCardFormBtn.classList.add("disable");
        const actionBtnList = document.querySelector("#actionBtnList");
        actionBtnList.classList.add("hidden");
        const sectionTxt = document.querySelector("#sectionTxt");
        sectionTxt.classList.add("hidden");

        cardDivForm.style.gridColumn = "1/6";
        cardDivForm.style.gridRow = "2/2";
        cardDivForm.appendChild(titleForm);

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
            sectionTxt.classList.remove("hidden");
            actionBtnList.classList.remove("hidden");

            createCardFormBtn.classList.remove("disable");
            createCardFormBtn.classList.add("way");
            updateProfilList.classList.remove("disableUpdate");
            updateProfilList.classList.add("edit");
            deleteProfilList.classList.remove("disableDelete");
            deleteProfilList.classList.add("delete");
            cardDivForm.style.gridColumn = "4/5";
            cardDivForm.style.gridRow = "1/2";

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

            if (dataCards.length !== 0) {
                oneList.style.borderRadius = "20px 20px 0 0";
                oneList.style.marginBottom = "0";
                cardArticleContent.style.borderRadius = "0 0 20px 20px";
                cardArticleContent.style.marginTop = "0";
            }

            if (localStorage.getItem("typeList") === "WishList" || localStorage.getItem("typeList") === "TodoList"){
                if(userId !== response.data.userId){
                    cardArticleContent.classList.add("third_party_wish");
                } else{
                    cardArticleContent.classList.add(type[localStorage.getItem("typeList")]);
                }
            }

            for (const indexCard in dataCards) {
                const objectCard = dataCards[indexCard];

                const cardSectionContent = document.createElement("section");
                cardSectionContent.id = `cardSectionContent-${objectCard.id}`;
                cardSectionContent.classList.add("card");
                cardSectionContent.classList.add("grid");

                if((userId !== response.data.userId) || (localStorage.getItem("typeList") === "TodoList")) {
                    cardSectionContent.classList.add("third_party_todo_card");
                } else {
                    cardSectionContent.classList.add("wish");
                }

                const divStar = document.createElement("div");
                divStar.id = "divStar";
                divStar.classList.add("grid_stars");

                const titleH3 = document.createElement("h3");
                titleH3.classList.add("grid_titleH3")
                const text = document.createElement("p");
                text.classList.add("grid_text_card");
                text.classList.add("dot");

                const divCheck = document.createElement("div");
                divCheck.id = "divCheck";
                divCheck.classList.add("grid_check_box");

                const labelCheck = document.createElement("label");
                labelCheck.for = "checkbox";
                labelCheck.innerText = checklabel;
                const check = document.createElement("input");
                check.id = `checked-${objectCard.id}`;
                check.title = checklabel;
                check.type = "checkbox";
                check.value = objectCard.checked;

                const actionBtnCard = document.createElement("section");
                actionBtnCard.id = "actionBtnCard";
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
                updateBtnCard.classList.add("inCard");
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
                deleteBtnCard.classList.add("inCard");
                deleteBtnCard.classList.add("listBtn");

                const priorityValue = objectCard.priority;

                if (check.value === "1") {
                    updateBtnCard.disabled = true;
                    updateBtnCard.classList.remove("edit");
                    updateBtnCard.classList.add("disableUpdate");
                    updateBtnCard.classList.remove("inCard");
                    updateBtnCard.classList.add("inCardChecked");
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

                    if((userId !== response.data.userId) || (response.data.type === "TodoList")) {
                        priority.classList.add("third_party_stars");
                    } else {
                        priority.classList.add("stars");
                    }
                    // priority.classList.add("stars");
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
                        toolTip(cardSectionContent, objectCard.updatedAt, response.data.user.login)
                    } else if (key === "checked") {
                        check.checked = objectCard.checked === 1;
                        if(check.checked) {
                            check.disabled = true;
                        }
                        cardSectionContent.appendChild(divCheck);
                        divCheck.appendChild(check);
                        divCheck.appendChild(labelCheck);
                    }

                    if (["id", "listId", "title", "priority", "checked", "createdAt", "updatedAt"].includes(`${key}`)) {
                        continue;
                    }

                    // Si objectCard[key] est une URL, modification de la balise "p" pour une balise "a".
                    //                        une chaîne de caractère normale, la balise de base est "p".
                    if (objectCard[key].search(/^http[s]?:\/\//) === 0) {
                        text.remove();
                        const link = document.createElement("a");
                        link.classList.add("grid_text_card");
                        link.classList.add("cardLink");
                        link.innerText = "lien vers la description";
                        link.setAttribute("href", `${objectCard[key]}`);
                        link.title = objectCard[key];
                        cardSectionContent.appendChild(link);
                    } else {
                        text.innerText = objectCard[key];
                        cardSectionContent.appendChild(text);
                    }

                    oneList.after(cardArticleContent);
                    cardArticleContent.appendChild(cardSectionContent);
                    cardSectionContent.appendChild(divStar);
                    actionBtnCard.appendChild(updateBtnCard);
                    actionBtnCard.appendChild(deleteBtnCard);
                }

                // Rend visible les boutons pour l'utilisateur courant uniquement
                if (canCreateCard) {
                    cardSectionContent.appendChild(actionBtnCard);

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
                        actionBtnCard.classList.remove("grid_action_btn_lists");
                        actionBtnCard.classList.add("grid_edit_card");
                        divStar.classList.add("hidden");

                        deleteBtnCard.after(updateCardSection);
                        updateCardSection.appendChild(titleForm)

                        titleForm.innerText = "Formulaire d'édition d'une carte";
                        titleForm.classList.add("width");

                        // Affichage du formulaire d'édition + dissimulation de la carte
                        displayFormCard(updateCardSection);

                        cardSectionContent.classList.add("hidden");

                        updateBtnCard.disabled = true;
                        updateBtnCard.classList.remove("edit");
                        updateBtnCard.classList.add("disableUpdate");
                        updateBtnCard.classList.add("inCard");

                        deleteBtnCard.disabled = true;
                        deleteBtnCard.classList.remove("delete");
                        deleteBtnCard.classList.add("disableDelete");
                        deleteBtnCard.classList.add("inCard");

                        // Affichage de la carte + suppression du formulaire d'édition
                        const updateFormCard  = document.querySelector("#formCard");
                        const cardCancelBtn = document.querySelector("#cardCancelBtn");
                        cardCancelBtn.addEventListener("click", function() {
                            updateBtnCard.disabled = false;
                            updateBtnCard.classList.add("edit");
                            updateBtnCard.classList.remove("disableUpdate");
                            actionBtnCard.classList.remove("grid_edit_card");
                            actionBtnCard.classList.add("grid_action_btn_lists");
                            divStar.classList.remove("hidden");

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