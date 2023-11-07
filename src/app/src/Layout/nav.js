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
    const nav = document.createElement("nav");
    nav.id = "mainNav";
    nav.className = "mainNav";
    const list = document.createElement("ul");

<<<<<<< Updated upstream
    if(user){
        const dataUser = JSON.parse(user);
        if (dataUser.is_admin){
            const links = [
                {text: "Liste d'utilisateurs", href: "http://localhost/listerr/src/app/src/admin/pages/profils.html", id: "usersProfil"},
            ];
            addLinks(links);
        };
    };

    if (token === undefined || token === null || user === null || user === undefined) {
        const links = [
            {text: "Inscription", href: "http://localhost/listerr/src/app/src/user/pages/registration.html", id: "register"},
            {text: "Connexion", href: "http://localhost/listerr/src/app/src/user/pages/login.html", id: "login"},
=======
    // Si l'utilisateur n'est pas connecté, affiche les liens d'inscription et de connexion.
    if (token === undefined || token === null || user === null || user === undefined) {
        const links = [
            {text: "Accueil", href: `${configPath.basePath}/home/pages/home.html`, id: "home"},
            {text: "Inscription", href: `${configPath.basePath}/user/pages/registration.html`, id: "register"},
            {text: "Connexion", href: `${configPath.basePath}/user/pages/login.html`, id: "login"},
>>>>>>> Stashed changes
        ];
        addLinks(links);
    };

    // Si l'utilisateur est connecté, affiche des liens pertinents.
    if (user !== undefined && user !== null) {
        const links = [
<<<<<<< Updated upstream
            {text: "Votre profil", href: "http://localhost/listerr/src/app/src/user/pages/profil.html", id: "profil"},
            {text: "Listes", href: "http://localhost/listerr/src/app/src/list/pages/list.html", id: "list"},
            {text: "Déconnexion", id: "logout"},
=======
            {text: "Accueil", href: `${configPath.basePath}/home/pages/home.html`, id: "home"},
            {text: "Déconnexion", id: "logout"},
            {text: "Votre profil", href: `${configPath.basePath}/user/pages/profil.html`, id: "profil"},
            {text: "Listes de souhaits et de tâches", href: `${configPath.basePath}/list/pages/lists.html`, id: "lists"},
>>>>>>> Stashed changes
        ];
        addLinks(links);
    };

<<<<<<< Updated upstream
=======
    // Si l'utilisateur est un administrateur, affiche des liens spécifiques à l'administrateur.
    if(user){
        const dataUser = JSON.parse(user);
        if (dataUser.role === "Admin"){
            const links = [
                {text: "Liste d'utilisateurs", href: `${configPath.basePath}/admin/pages/profils.html`, id: "usersProfil"},
            ];
            addLinks(links);
        };
    };

    /**
     * Ajoute des liens à la barre de navigation.
     *
     * @param {Array} links - Un tableau d'objets contenant les données des liens à ajouter.
     */
>>>>>>> Stashed changes
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