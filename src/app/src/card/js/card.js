"use strict";

import { fetchCreateCard } from "../../actions/actions_cards.js";
import { CSRFToken } from "../../services/CSRFToken.js";
import { createCardForm } from "./form_card.js";

function createCard() {
    const oneList = document.querySelector("#oneList");
    
    const card = document.createElement("div");
    card.id = "newCard";
    card.class = "newCard";

    const createCardBtn = document.createElement("button");
    createCardBtn.id = `newCard`;
    createCardBtn.name = "newCard";
    createCardBtn.type = "button";
    createCardBtn.value = `newCard`;
    createCardBtn.textContent = "Nouveau souhait / nouvelle tâche"

    createCardBtn.addEventListener("click", function(e){
        if (createCardBtn.value !== "newCard") {
            return false;
        }
        createCardBtn.disabled = true;
        const newCard = document.querySelector("#newCard");
        createCardForm(newCard);

        const cardForm = document.querySelector("#createFormCard");
        CSRFToken(cardForm.id);

        cardForm.addEventListener("submit", function(e) {
            e.preventDefault();
            createCardBtn.disabled = false;

            if (e.submitter.value === "CardCanceBtnl") {
                cardForm.remove();
            } else {
                fetchCreateCard(cardForm.id)
                .then(response => {
                    console.log("fetch card coucou");
                })
            }
        })


    })

    oneList.after(card);
    card.appendChild(createCardBtn);
}

document.addEventListener("DOMContentLoaded", () => {
    createCard();
});