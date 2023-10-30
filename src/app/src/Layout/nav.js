"use strict";

import { configPath } from "../../src/services/config.js";

function navigation(template) {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const nav = document.createElement("nav");
    nav.id = "mainNav";
    nav.className = "mainNav";
    const list = document.createElement("ul");

    if (token === undefined || token === null || user === null || user === undefined) {
        const links = [
            {text: "Accueil", href: `${configPath.basePath}/home/pages/home.html`, id: "home"},
            {text: "Inscription", href: `${configPath.basePath}/user/pages/registration.html`, id: "register"},
            {text: "Connexion", href: `${configPath.basePath}/user/pages/login.html`, id: "login"},
        ];
        addLinks(links);
    };

    if (user !== undefined && user !== null) {
        const links = [
            {text: "Accueil", href: `${configPath.basePath}/home/pages/home.html`, id: "home"},
            {text: "Déconnexion", id: "logout"},
            {text: "Votre profil", href: `${configPath.basePath}/user/pages/profil.html`, id: "profil"},
            {text: "Listes de souhaits et de tâches", href: `${configPath.basePath}/list/pages/lists.html`, id: "lists"},
        ];
        addLinks(links);
    };

    if(user){
        const dataUser = JSON.parse(user);
        if (dataUser.role === "Admin"){
            const links = [
                {text: "Liste d'utilisateurs", href: `${configPath.basePath}/admin/pages/profils.html`, id: "usersProfil"},
            ];
            addLinks(links);
        };
    };

    function addLinks(links) {

        links.forEach(linkData => {
            const link = document.createElement("a");
            const item = document.createElement("li");

            if(linkData.href !== undefined) {
                link.setAttribute("href", linkData.href);
                link.id = linkData.id;
                link.innerText = linkData.text;
            } else {
                const noLink = document.createElement("div");
                noLink.id = linkData.id;
                noLink.innerText = linkData.text;
                item.appendChild(noLink);
            };
            item.appendChild(link);
            list.appendChild(item);
        });
        nav.appendChild(list);
        template.appendChild(nav);
    }
};

export { navigation };