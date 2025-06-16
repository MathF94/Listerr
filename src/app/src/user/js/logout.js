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

import { fetchLogout } from "../../actions/actions_user.js";

import {
    configPath,
    redirect,
    dialog
} from "../../services/utils.js";

/**
 * Gère le processus de déconnexion de l'utilisateur.
 */
function logout() {
    const anchorLogout = document.querySelector("#logout");
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token === null || user === null) {
        return;
    }
    fetchLogout()
    .then((response) => {
        if (response.status === "disconnect") {
            dialog({
                title: `A bientôt ${response.login} !`,
                content: `<p>Votre session n'est pas ou plus active.</p>
                    <p>Vous allez être redirigé(e) dans quelques instants vers la page de connexion...</p>`,
            });
            const dialogMsg = document.querySelector("dialog");
            dialogMsg.classList.add("logout");

            const nav = document.querySelector("#mainNav");
            nav.classList.add("hidden");

            const labelBurger = document.querySelector("#labelBurger");
            labelBurger.classList.add("hidden");

            const allListsSection = document.querySelector("#allListsSection");
            if (allListsSection) {
                allListsSection.classList.add("hidden");
            }

            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.nav_active ="home";
            redirect(`${configPath.basePath}/user/pages/login.html`, 3000);
        }

        anchorLogout.addEventListener("click", function (e) {
            e.preventDefault();
            if (confirm("Voulez-vous vraiment vous déconnecter ?") === true) {
                if (response.status === "connected") {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    dialog({
                        title: `A bientôt ${response.login} !`,
                        content: "Vous allez être redirigé(e) dans quelques instants vers la page de connexion..."
                    });

                    const dialogMsg = document.querySelector("dialog");
                    dialogMsg.classList.add("logout");

                    const nav = document.querySelector("#mainNav");
                    nav.classList.add("hidden");

                    const labelBurger = document.querySelector("#labelBurger");
                    labelBurger.classList.add("hidden");

                    const allListsSection = document.querySelector("#allListsSection");
                    if (allListsSection) {
                        allListsSection.classList.add("hidden");
                    }
                    localStorage.nav_active ="home";
                    redirect(`${configPath.basePath}/home/pages/home.html`);
                }
            }
        })
    })
}

document.addEventListener("DOMContentLoaded", () => {
    logout();
});

export { logout };
