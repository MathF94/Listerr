'use strict';

import { fetchRegister } from "./actions";

function registration() {
    const form = document.querySelector('form');

    form.addEventListener('submit', function(e){
        e.preventDefault();

        const name = e.target.children.name.value;
        const firstname = e.target.children.firstname.value;
        const login = e.target.children.login.value;
        const email = e.target.children.email.value;

        fetchRegister(form)
        .then(response => {
            const wrapper = document.getElementById('wrapper');
            const msg = document.createElement('div');
            const errors = response.errors;

            if (response.status === 'success') {
                msg.innerHTML = `
                <p>Bonjour ${firstname} ${name}</p>
                <p>Votre compte lié à l'adresse ${email} est maintenant créé sous le login ${login}.</p>
                <p>Vous allez être redirigé dans quelques secondes vers la page de connexion...</p>
                `
                wrapper.append(msg);

                window.setTimeout(function() {
                    window.location.href = "http://localhost/listerr/src/app/src/user/login.html"
                }, 5000)
            } else {
                msg.innerHTML = `L'inscription s'est mal passée.`;
                wrapper.append(msg);
            }

            if(response.status === 'fail') {
                for(const index in errors){
                    const ul = document.createElement('ul');
                    const li = document.createElement('li');
                    const column = errors[index];
                    li.innerText = `${column}`;
                    msg.innerHTML = `<p>Merci de respecter les champs du formulaire.</p>`
                    ul.append(li);
                    wrapper.append(ul);
                    wrapper.append(msg);
                    window.setTimeout(function() {
                        window.location.href = `http://localhost/listerr/src/app/src/user/registration.html`
                        }, 3000)
                }
            }
        })
    })
}

document.addEventListener("DOMContentLoaded", () => {
    registration();
})

