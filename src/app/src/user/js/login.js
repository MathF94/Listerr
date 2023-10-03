'use strict';

import { fetchLogin } from "./actions.js";
import { redirect, dialog } from "../../services/utils.js";

function login() {
    const form = document.querySelector('form');
    form.addEventListener('submit', function(e){
        e.preventDefault();

        fetchLogin(form)
        .then(response => {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify({
                id: response.user_id,
                is_admin: response.user_isAdmin
            }))

            if (response.status === 'success') {
                const login = e.target.children.login.value;
                dialog({title: `<p>Bonjour ${login} !</p>`, content: `<p>Vous êtes bien connecté(e).</p>`});
                redirect('http://localhost/listerr/src/app/src/user/pages/profil.html', 3000);
            };

            if (response.status === 'fail_data') {
                dialog({title: "Erreurs de données", content: response.message, hasTimeOut: true});
                redirect('http://localhost/listerr/src/app/src/user/pages/login.html', 3000);
            };

            if (response.status === 'fail') {
                dialog({title: "Erreurs", content: response.errors, hasTimeOut: true});
                redirect('http://localhost/listerr/src/app/src/user/pages/login.html', 3000);
            };
        });
    });
};

document.addEventListener("DOMContentLoaded", () => {
    login();
});


