'use strict';

async function fetchUser(form) {
    try {
        const url = 'http://localhost/listerr/src/api/?route=user_login';
        return await fetch(url, {
            method: 'POST',
            body: new FormData(form)
        }).then(response => response.json());

    } catch (error) {
        console.error('Erreur lors de la requête fetch :', error);
        return null;
    }
}

// .then(response=>{
//     localStorage.setItem('token_user', response.token);
//     console.log(response);
// });
// pour recherche le token =
//          * localStorage.getItem('token_user');
//          *
//          * pour supprimer
//          * localStorage.removeItem('token_user');
//          *
//          * dans l'idée, quand on fait le login, avec un fetch, on récupère le token (getItem)
//          * et on l'utilise à la place du login actuel
//          *
//          * pour le logout, avec un fetch on récupère le token et au retour du logout on fait
//          * un removeItem('token_user')
//          */

function login() {
    const form = document.querySelector('form');
    const tokenUser = localStorage.getItem('token');

    form.addEventListener('submit', function(e){
        e.preventDefault();

        const login = e.target.children.login.value;

        fetchUser(form)
        .then(response => {
            localStorage.setItem('token', response.token);
            console.log('token du localStorage : ', localStorage.token);
            console.log(response.status, response.connected);

            const wrapper = document.getElementById('wrapper');
            const msg = document.createElement('div');

            if(response.status === 'success') {
                msg.innerHTML = `
                <p>Bonjour ${login} !</p>
                <p>Vous êtes bien connecté(e).</p>
                `
                wrapper.append(msg);

                window.setTimeout(function() {
                window.location.href = `http://localhost/listerr/src/app/src/user/display.html`
                }, 5000)
            } else {
                msg.innerHTML = `La connexion s'est mal passée.`;
            }
        })
    })
}

document.addEventListener("DOMContentLoaded", () => {
    login();
});


