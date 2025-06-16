/*
 * listerr - gestionnaire de listes et tâches
 * Copyright (C) 2025 Mathieu Fagot
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
