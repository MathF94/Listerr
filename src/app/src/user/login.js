'use strict';

import { fetchLogin } from "./actions";

function login() {
    const form = document.querySelector('form');

    form.addEventListener('submit', function(e){
        e.preventDefault();
        const login = e.target.children.login.value;

        fetchLogin(form)
        .then(response => {

            localStorage.setItem('token', response.token);
            console.log(response.token);
            const wrapper = document.getElementById('wrapper');
            const msg = document.createElement('div');
            const errors = response.errors;
            console.log(response.errors);

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

            if (response.status === 'fail_data') {
                msg.innerHTML = `<p>${response.message}</p>`;
                wrapper.append(msg);

                window.setTimeout(function() {
                window.location.href = `http://localhost/listerr/src/app/src/user/login.html`
                }, 3000)
            }

            if (response.status === 'fail') {
                for(const index in errors){
                    const ul = document.createElement('ul');
                    const li = document.createElement('li');
                    const column = errors[index];
                    li.innerText = `${column}`;
                    msg.innerHTML = `<p>Merci de conditions de remplissage des champs du formulaire.</p>`
                    ul.append(li);
                    wrapper.append(ul);
                    wrapper.append(msg);
                    window.setTimeout(function() {
                        window.location.href = `http://localhost/listerr/src/app/src/user/login.html`
                        }, 3000)
                }
            }
        })
    })
}

document.addEventListener("DOMContentLoaded", () => {
    login();
});


