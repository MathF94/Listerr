"use strict";

import {
    fetchCreateCard,
    fetchReadAllCardsByList,
    fetchUpdateCard,
    fetchDeleteCard,
} from "../../actions/actions_cards.js";
import { CSRFToken } from "../../services/CSRFToken.js";
import {
    configPath,
    redirect,
    dialog
} from "../../services/utils.js";
import { createCardForm } from "./form_card.js";

/**
 * Fonction principale pour gérer les cartes d'une liste.
 */
function card(canCreateCard) {
    // Obtient l'identifiant de la liste à partir des paramètres de l'URL.
    const urlParams = new URLSearchParams(document.location.search);
    const id = urlParams.get("id");
    const oneList = document.querySelector("#oneList");

    const cardSectionForm = document.createElement("div");
    cardSectionForm.id = "cardSectionForm";
    cardSectionForm.class = "cardSectionForm";

    const createCardFormBtn = document.createElement("button");
    createCardFormBtn.id = `cardFormBtn`;
    createCardFormBtn.name = "cardFormBtn";
    createCardFormBtn.type = "button";
    createCardFormBtn.value = `cardFormBtn`;

    // Affichage du contenu du bouton en fonction du type de liste
    let btnLabel = "Nouveau souhait";
    if (localStorage.getItem("typeList") === "TodoList") {
        btnLabel = "Nouvelle tâche";
    }
    createCardFormBtn.textContent = btnLabel;

    const updateProfilList = document.querySelector(`#updateProfilList-${id}`);
    // Désactive le bouton de création de cartes si update de liste en cours
    updateProfilList.addEventListener("click", function(e){
        e.preventDefault();
        if (updateProfilList.disabled === true) {
            createCardFormBtn.disabled = true;

            const cancelBtn = document.querySelector("#updateBtnListCancel");
            // Réactive le bouton de création de cartes si annulation
            cancelBtn.addEventListener("click", function(e){
                e.preventDefault();
                if (createCardFormBtn.disabled === true) {
                    createCardFormBtn.disabled = false
                };
            })
        }
    })


    // Affichage du formulaire au click du bouton
    createCardFormBtn.addEventListener("click", function(e){
        if (createCardFormBtn.value !== "cardFormBtn") {
            return false;
        }
        // Bouton rendu inutilisable
        createCardFormBtn.disabled = true;
        updateProfilList.disabled = true;
        // Appel du formulaire de création d'une carte
        createCardForm(cardSectionForm);

        const cardCancelBtn = document.querySelector("#cardCancelBtn");
        const cardForm = document.querySelector("#createFormCard");

        // Suppression du formulaire au click du bouton
        cardCancelBtn.addEventListener("click", function(){
            updateProfilList.disabled = false;
            createCardFormBtn.disabled = false;
            cardForm.remove();
        })

        CSRFToken(cardForm.id);
        cardForm.addEventListener("submit", function(e) {
            e.preventDefault();
            createCardFormBtn.disabled = false;

            fetchCreateCard(cardForm, id)
            .then(response => {
                localStorage.removeItem("csrfToken");

                if (response.status === "success") {
                    dialog({title: "Et voilà la carte !", content:"à la suivante !"});
                    redirect(`${configPath.basePath}/list/pages/list.html?id=${id}`);

                }
                if (response.status === "fail") {
                    dialog({title: "Erreurs", content: response.errors, hasTimeOut: true});
                    redirect(`${configPath.basePath}/list/pages/list.html?id=${id}`);
                };
            });
        });
    });

    if (canCreateCard) {
        // oneList.appendChild(createCardFormBtn);
        oneList.appendChild(cardSectionForm);
        cardSectionForm.appendChild(createCardFormBtn);
    }

    fetchReadAllCardsByList(id)
    .then(response => {
        if (response.status === "readOneList") {
            const dataCards = response.data.cards;
            const cardSectionContent = document.createElement("div");
            cardSectionContent.id = "cardSectionContent";
            cardSectionContent.classList.add("sectionCard");

            for (const indexCard in dataCards) {
                const objectCard = dataCards[indexCard];

                const contentCard = document.createElement("div");
                contentCard.id = `ContentCard-${objectCard.id}`;
                contentCard.classList.add("contentCard");

                const check = document.createElement("input");
                check.type = "checkbox";
                check.checked = false;

                const deleteBtnCard = document.createElement("button");
                deleteBtnCard.id = `deleteCard-${objectCard.id}`;
                deleteBtnCard.name = "deleteCard";
                deleteBtnCard.type = "button";
                deleteBtnCard.value = `${objectCard.id}`;
                deleteBtnCard.textContent = "Supprimer";
                deleteBtnCard.classList.add("deleteCard");

                const updateBtnCard = document.createElement("button");
                updateBtnCard.id = `updateCard-${objectCard.id}`;
                updateBtnCard.name = "updateCard";
                updateBtnCard.type = "submit";
                updateBtnCard.value = `${objectCard.id}`;
                updateBtnCard.textContent = "Modifier";
                updateBtnCard.classList.add("updateCard");

                const priorityValue = objectCard.priority;

                // Boucle de création des étoiles (pleines ou vides) en fonction de la priorité
                for (let i = 0 ; i < 5; i++) {
                    const priority = document.createElement("span");
                    priority.classList.add("star");
                    priority.setAttribute("data-star", i+1);
                    priority.textContent = i < priorityValue ? "\u2605" : "\u2606" ;
                    contentCard.appendChild(priority);
                }

                // Affichage des éléments de la carte
                for (const key in objectCard) {
                    const text = document.createElement("p");

                    if (["id", "listId", "checked", "priority"].includes(`${key}`)) {
                        continue;
                    };

                    if (key === "createdAt") {
                        text.innerText = `Créée le ${objectCard.createdAt}`;
                    } else if (key === "updatedAt") {
                        text.innerText = `Modifiée le ${objectCard.updatedAt}`;
                    } else  {
                        text.innerText = `${objectCard[key]}`;
                    };
                    if (key === "checked") {
                        check.checked = Boolean(objectCard.checked);
                    }

                    contentCard.appendChild(text);

                    // Rend visible l'input "check" et les boutons pour l'utilisateur courant uniquement
                    if (canCreateCard) {
                        contentCard.appendChild(updateBtnCard);
                        contentCard.appendChild(deleteBtnCard);
                    }
                    oneList.after(cardSectionContent);
                    cardSectionContent.appendChild(contentCard);
                    contentCard.appendChild(check);
                }

                // Gestion de la suppression de carte
                deleteBtnCard.addEventListener("click", function(e) {
                    e.preventDefault();
                    const btnCardId = parseInt(e.target.value);

                    if (btnCardId !== objectCard.id) {
                        console.warn("pas touche");
                        return;
                    } else if (confirm('Voulez-vous vraiment vous supprimer la liste ?') === true) {
                        fetchDeleteCard(objectCard.id)
                        .then(() => {
                            dialog({title: "Suppression de la carte",
                            content: `<p>Votre carte a bien été supprimée.</p>`
                            });
                            redirect(`${configPath.basePath}/list/pages/list.html?id=${id}`);
                        });
                    }
                })
            }
        }
    })
}

export { card };