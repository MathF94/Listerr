"use strict";

import { navigation } from "./nav.js";

import { configPath, redirect } from "../services/utils.js";

function header() {
    const header = document.createElement("header")
    header.id = "navWrapper";
    header.className = "navWrapper";

    const title = document.createElement("h1")
    title.id = "mainTitle";
    title.innerText = "listerr";

    title.addEventListener("click", function(e){
        e.preventDefault();
        localStorage.nav_active ="home";
        redirect(`${configPath.basePath}/home/pages/home.html`);
    })
    title.addEventListener("touchstart", function(e){
        e.preventDefault();
        localStorage.nav_active ="home";
        redirect(`${configPath.basePath}/home/pages/home.html`);
    })

    navigation(header);
    header.appendChild(title)
    document.body.prepend(header);
}

document.addEventListener("DOMContentLoaded", () => {
    header();
})
