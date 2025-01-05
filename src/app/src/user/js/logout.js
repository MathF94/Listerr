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
