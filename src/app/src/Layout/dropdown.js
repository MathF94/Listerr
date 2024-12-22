"use strict";

import { configPath, detail, menu } from "../services/utils.js";

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

    // LES DIFFERENTS CAS
    // CAS DE LA PAGE home/pages/home.html`
    if (window.location.href === `${configPath.basePath}/home/pages/home.html`) {
        if (localStorage.user !== null && localStorage.user !== undefined) {
            const action = [
                {
                    text : detail(updatedAt, login)
                }
            ]
            addActions(action)
        }
    }

    // CAS DE LA PAGE home/pages/home.html`
    if (window.location.href === `${configPath.basePath}/user/pages/profil.html` + window.location.search) {
        if (JSON.parse(localStorage.user).role === 'Admin') {
            const action = [
                {
                    text : detail(updatedAt, login)
                }
            ]
            addActions(action)
        }
    }

    // CAS DE LA PAGE list/pages/lists.html
    if (window.location.href === `${configPath.basePath}/list/pages/lists.html`) {
        if (localStorage.user !== null && localStorage.user !== undefined) {
            const action = [
                {
                    text : detail(updatedAt, login)
                }
            ]
            addActions(action)
        }
    }

    // CAS DE LA PAGE list/pages/list.html?id=XXX
    if (window.location.href === `${configPath.basePath}/list/pages/list.html` + window.location.search) {
        if (localStorage.user === null || localStorage.token === null || localStorage.user === undefined || localStorage.token === undefined) {
            const action = [
                {
                    text : detail(updatedAt, login)
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
            if (userId !== userIDList) {
                const action = [
                    {
                        text : detail(updatedAt, login)
                    }
                ]
                addActions(action)
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
            moreMenuBtn.classList.add("pointer");
            moreMenuBtn.innerText = actionData.text;

            if (moreMenuBtn.tagName === "SMALL") {
                moreMenuBtn.classList.remove("pointer");
            }

            moreMenuListUl.appendChild(moreMenuItemLi);
            moreMenuItemLi.appendChild(moreMenuBtn);
        });

        template.appendChild(containerSection)
        menu(dataId);
    }
}

export { dropDownMenu };