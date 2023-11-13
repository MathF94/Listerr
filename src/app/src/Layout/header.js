"use strict";

import { navigation } from "./nav.js";

function header() {
    const header = document.createElement("header")
    header.id = "navWrapper";
    header.className = "navWrapper";

    const title = document.createElement("h1")
    title.id = "mainTitle";
    title.className = "mainTitle";
    title.innerText = "listerr";

    navigation(header);
    header.appendChild(title)
    document.body.prepend(header);
}

document.addEventListener("DOMContentLoaded", () => {
    header();
})
