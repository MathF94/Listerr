"use strict";

import { configPath, menu } from "../services/utils.js";

function dropDownMenu(template, dataId, updatedAt, login, actions) {
    const containerSection = document.createElement("div");
    containerSection.classList.add("container");
    containerSection.id = `dropDown-${dataId}`;

    const moreDiv = document.createElement("div");
    moreDiv.classList.add("more");

    const moreBtn = document.createElement("button");
    moreBtn.id = `moreBtn-${dataId}`;
    moreBtn.classList.add("more__btn");

    const moreDot = document.createElement("span");

    const moreMenuDiv = document.createElement("div");
    moreMenuDiv.classList.add("more__menu");

    const moreMenuCaretDiv = document.createElement("div");
    moreMenuCaretDiv.classList.add("more__menu__caret");
    const moreMenuCaretOuterDiv = document.createElement("div");
    moreMenuCaretOuterDiv.classList.add("more__menu__caret__outer");
    const moreMenuCaretInnerDiv = document.createElement("div");
    moreMenuCaretInnerDiv.classList.add("more__menu__caret__inner");

    const moreMenuListUl = document.createElement("ul");
    moreMenuListUl.classList.add("more__menu__list");

    // moreMenuItemLi.classList.add("more__menu__item");

    containerSection.appendChild(moreDiv);
    moreDiv.appendChild(moreBtn);
    moreBtn.appendChild(moreDot);
    moreDiv.appendChild(moreMenuDiv);
    moreMenuDiv.appendChild(moreMenuCaretDiv);
    moreMenuCaretDiv.appendChild(moreMenuCaretOuterDiv);
    moreMenuCaretDiv.appendChild(moreMenuCaretInnerDiv);
    moreMenuDiv.appendChild(moreMenuListUl);


    let dateFromDatabase = updatedAt ;
    let date = new Date(dateFromDatabase);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let formatedDate = (day < 10 ? '0' : '') + day + '/'
                        + (month < 10 ? '0' : '') + month + '/'
                        + year;

    // LES DIFFERENTS CAS
    // console.log(`${configPath.basePath}/home/pages/home.html`);
        // connectés (propriétaires ou visiteurs)

    // console.log(`${configPath.basePath}/list/pages/lists.html`);
        // connectés propriétaires
        // connectés admin

    // console.log(`${configPath.basePath}/list/pages/list.html?id=XXX`);
        // connectés propriétaires
        // connectés visiteurs
        // visiteurs non inscrits

    if (window.location.href === `${configPath.basePath}/list/pages/list.html` + window.location.search) {
        if (localStorage.user === null || localStorage.token === null || localStorage.user === undefined || localStorage.token === undefined) {
            const action = [
                {
                    text : `Modifié par ${login} \n le ${formatedDate}`
                }
            ]
            addActions(action)
        }

        if (localStorage.user !== null && localStorage.user !== undefined ) {
            const userId = JSON.parse(localStorage.user).id;
            const userIDList = parseInt(localStorage.userIDList);

            if (userId === userIDList) {

                addActions(actions)
            }
        }

    }

    function addActions(actions) {
        actions?.forEach(actionData => {
            const moreMenuItemLi = document.createElement("li");
            moreMenuItemLi.classList.add("more__menu__item");

            const moreMenuBtn = document.createElement(actionData.onclick?"button":"small");
            moreMenuBtn.type = "button";
            moreMenuBtn.value = dataId;
            moreMenuBtn.addEventListener("click", (e)=>{
                e.preventDefault()
                actionData.onclick?actionData.onclick(e):null
            })
            moreMenuBtn.classList.add("more__menu__btn");
            moreMenuBtn.innerText = actionData.text;

            // const detail = document.createElement("small");
            // detail.innerText = actionData.details;

            moreMenuListUl.appendChild(moreMenuItemLi);
            moreMenuItemLi.appendChild(moreMenuBtn);
        });

        template.appendChild(containerSection)
        menu(dataId);
    }
}

export { dropDownMenu };