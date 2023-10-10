"use strict";

import { addRoute } from "../services/routes.js"
import View  from "../services/view.js";
import { header } from "./header.js";

document.addEventListener("DOMContentLoaded", () => {

    const basePath = '.';

    addRoute('/', 'index', () => {
        View.load(`${basePath}/index`);
    });

    addRoute('/registration.html', 'registration', () => {
        View.load(`${basePath}/registration`);
    });
    
    addRoute('/login.html', 'login', () => {
        View.load(`${basePath}/login`);
    });
    addRoute('/profil.html', 'user_profil', () => {
        View.load(`${basePath}/profil`);
    });
    
    addRoute('/admin/users.html', 'admin_users', () => {
        View.load(`${basePath}/profils`);
    });
    
    addRoute('/user/update.html', 'user_update', () => {
        View.load(`${basePath}/update`);
    });


    header();
})