"use strict";

import { fetchCreateCard, fetchReadAllCardsByList } from "../../actions/actions_cards.js";
import { CSRFToken } from "../../services/CSRFToken.js";
import { configPath, redirect, dialog } from "../../services/utils.js";
import { createCardForm } from "./form_card.js";

function card(canCreateCard) {
    const urlParams = new URLSearchParams(document.location.search);
    const id = urlParams.get("id");

    const oneList = document.querySelector("#oneList");

    const cardSection = document.createElement("section");
    cardSection.id = "newCard";
    cardSection.class = "newCard";

    const createCardBtn = document.createElement("button");
    createCardBtn.id = `newCard`;
    createCardBtn.name = "newCard";
    createCardBtn.type = "button";
    createCardBtn.value = `newCard`;

    let btnLabel = "Nouveau souhait";
    if (localStorage.getItem("typeList") === "TodoList") {
        btnLabel = "Nouvelle tâche";
    }
    createCardBtn.textContent = btnLabel;

    createCardBtn.addEventListener("click", function(e){
        if (createCardBtn.value !== "newCard") {
            return false;
        }
        createCardBtn.disabled = true;
        const newCard = document.querySelector("#newCard");

        createCardForm(newCard);

        const cardForm = document.querySelector("#createFormCard");
        CSRFToken(cardForm.id);

        const cardCancelBtn = document.querySelector("#CardCancelBtn");
        cardCancelBtn.addEventListener("click", function(){
            createCardBtn.disabled = false;
            cardForm.remove();
        })

        cardForm.addEventListener("submit", function(e) {
            e.preventDefault();
            createCardBtn.disabled = false;

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
        oneList.after(cardSection);
        cardSection.appendChild(createCardBtn);
    }

    fetchReadAllCardsByList(id)
    .then(response => {
        if (response.status === "readOneList") {
            const dataCards = response.data.cards;

            for (const indexCard in dataCards) {
                const objectCard = dataCards[indexCard];

                const contentCard = document.createElement("div");
                contentCard.id = `card-${objectCard.id}`;
                contentCard.classList.add("contentCard");

                const check = document.createElement("input");
                check.type = "checkbox";
                check.checked = false;

                const deleteBtnCard = document.createElement("button");
                deleteBtnCard.id = `deleteCard-${objectCard.id}`;
                deleteBtnCard.name = "deleteCard";
                deleteBtnCard.type = "submit";
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

                for (let i = 0 ; i < 5; i++) {
                    const priority = document.createElement("span");
                    priority.classList.add("star");
                    priority.setAttribute("data-star", i+1);
                    priority.textContent = i < priorityValue ? "\u2605" : "\u2606" ;
                    contentCard.appendChild(priority);
                }

                for (const key in objectCard) {
                    const text = document.createElement("p");
                    const small = document.createElement("small");

                    if (["id", "listId", "checked", "priority"].includes(`${key}`)) {
                        continue;
                    };

                    if (key === "createdAt") {
                        small.innerText = `Créée le ${objectCard.createdAt}`;
                    } else if (key === "updatedAt") {
                        small.innerText = `Modifiée le ${objectCard.updatedAt}`;
                    } else  {
                        text.innerText = `${objectCard[key]}`;
                    };
                    if (key === "checked") {
                        check.checked = Boolean(objectCard.checked);
                    }

                    contentCard.appendChild(text);
                    contentCard.appendChild(small);
                    contentCard.appendChild(check);
                    contentCard.appendChild(deleteBtnCard);
                    contentCard.appendChild(updateBtnCard);
                    cardSection.after(contentCard);
                }
            }
        }
    })
}

export { card };