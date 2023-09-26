'use strict';

import { fetchLogin } from "./actions";

function login() {
    const form = document.querySelector('form');

    form.addEventListener('submit', function(e){
        e.preventDefault();

        const login = e.target.children.login.value;

        fetchLogin(form)
        .then(response => {console.log(response);
            localStorage.setItem('token', response.token);
            console.log('token du localStorage : ', localStorage.token);
            console.log(response.status);

            const wrapper = document.getElementById('wrapper');
            const msg = document.createElement('div');

            if (response.status === 'success') {
                msg.innerHTML = `
                <p>Bonjour ${login} !</p>
                <p>Vous êtes bien connecté(e).</p>
                `
                wrapper.append(msg);

                window.setTimeout(function() {
                window.location.href = `http://localhost/listerr/src/app/src/user/profil.html`
                }, 3000)
            }

            if (response.status === 'failed') {
                msg.innerHTML = `
                <p>L'identifiant ou le mot de passe sont incorrects ! </p>
                <p>Veuillez recommencer svp...</p>`;
                wrapper.append(msg);
                window.setTimeout(function() {
                    window.location.href = `http://localhost/listerr/src/app/src/user/login.html`
                    }, 3000)
            }
        })
    })
}

document.addEventListener("DOMContentLoaded", () => {
    login();
});


