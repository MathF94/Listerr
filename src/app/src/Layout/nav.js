"use strict";

import { configPath } from "../services/utils.js";

/**
 * Génère la barre de navigation en fonction de l'état de connexion de l'utilisateur.
 *
 * @param {HTMLElement} template - L'élément HTML dans lequel la barre de navigation sera générée.
 */
function navigation(template) {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    const wrapDiv = document.createElement("div");
    wrapDiv.id = "hamburger-menu";

    const input = document.createElement("input");
    input.id= "menu__toggle";
    input.type = "checkbox";

    const label = document.createElement("label");
    label.id = "labelBurger";
    label.title = "Menu";
    label.classList.add("menu__btn");
    label.htmlFor = "menu__toggle";

    const span = document.createElement("span");
    const list = document.createElement("ul");
    const nav = document.createElement("nav");
    nav.id = "mainNav";
    nav.className = "menu__box";

    wrapDiv.appendChild(input);
    wrapDiv.appendChild(label);
    label.appendChild(span);
    wrapDiv.appendChild(nav);
    nav.appendChild(list);

    // Si l'utilisateur n'est pas connecté, affiche les liens d'inscription et de connexion.
    if (token === undefined || token === null || user === null || user === undefined) {
        const links = [
            {
                text: "Accueil",
                href: `${configPath.basePath}/home/pages/home.html`,
                id: "home",
            },
            {
                text: "Inscription",
                href: `${configPath.basePath}/user/pages/registration.html`,
                id: "register",
            },
            {
                text: "Connexion",
                href: `${configPath.basePath}/user/pages/login.html`,
                id: "connexion",
            },
        ];
        addLinks(links);
    }

    // Si l'utilisateur est connecté, affiche des liens pertinents.
    if (user !== undefined && user !== null) {
        const links = [
            {
                text: "Accueil",
                href: `${configPath.basePath}/home/pages/home.html`,
                id: "home",
            },
            {
                text: "Déconnexion",
                id: "logout"
            },
            {
                text: "Votre profil",
                href: `${configPath.basePath}/user/pages/profil.html`,
                id: "profil",
            },
            {
                text: "Vos listes",
                href: `${configPath.basePath}/list/pages/lists.html`,
                id: "lists",
            },
        ];
        addLinks(links);
    }

    // Si l'utilisateur est un administrateur, affiche des liens spécifiques à l'administrateur.
    if (user) {
        const dataUser = JSON.parse(user);
        if (dataUser.role === "Admin") {
            const links = [
                {
                    text: "Utilisateurs",
                    href: `${configPath.basePath}/admin/pages/profils.html`,
                    id: "usersProfil",
                },
            ];
            addLinks(links);
        }
    }

    /**
     * Ajoute des liens à la barre de navigation.
     *
     * @param {Array} links - Un tableau d'objets contenant les données des liens à ajouter.
     */
    function addLinks(links) {
        links.forEach((linkData) => {
            const item = document.createElement("li");
            const link = document.createElement("a");
            link.classList.add("menu__item");
            
            if (linkData.href !== undefined) {
                link.setAttribute("href", linkData.href);
                link.id = linkData.id;
                link.onclick = e => localStorage.setItem("nav_active", linkData.id)
                link.innerText = linkData.text;
                link.classList.remove("active");

                if(localStorage.nav_active === linkData.id) {
                    link.classList.add("active");
                }
            } else {
                const noLink = document.createElement("div");
                noLink.id = linkData.id;
                noLink.innerText = linkData.text;
                item.appendChild(link);
                link.appendChild(noLink);
            }
            list.appendChild(item);
            item.appendChild(link);

            if (item.textContent === "Déconnexion") {
                item.style.cursor = "pointer";
            }
        });
        template.appendChild(wrapDiv);
    }
}

export { navigation };
