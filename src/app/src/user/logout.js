'use strict';

import { fetchLogout } from "./actions";

function logout() {
    const anchorLogout = document.querySelector('#logout');
    localStorage.getItem('token');

    fetchLogout()
    .then(response => {console.log(response.status)
            console.log(response.token);

            if (response.status === 'disconnect') {
                const mainSection = document.getElementById('mainSection');
                const msg = document.createElement('dialog');
                msg.open = 'open';
                msg.innerHTML = `
                <p>Votre session n'est pas ou plus active.</p>
                <p>Vous allez être redirigé(e) dans quelques instants vers la page de connexion...</p>
                `
                mainSection.append(msg);
                window.setTimeout(function() {
                    window.location.href = `http://localhost/listerr/src/app/src/user/login.html`
                    }, 5000)
                }

            anchorLogout.addEventListener('click', function(e) {
                e.preventDefault();
                const btnSubmit = e.submitter;

            if (confirm('Voulez-vous vraiment vous déconnecter ?') === true) {
                if(response.status === 'connected') {
                    console.log(localStorage.token); // token présent
                    localStorage.removeItem('token'); // suppression du token
                    console.log(localStorage.token); // token undefined
                    const mainSection = document.getElementById('mainSection');
                    const msg = document.createElement('dialog');
                    msg.open = 'open';

                        msg.innerHTML = `
                    <p>A bientôt ${response.login}</p>
                    <p>Vous allez être redirigé dans quelques instants vers la page de connexion...</p>
                    `
                    mainSection.append(msg);

                    window.setTimeout(function() {
                    window.location.href = `http://localhost/listerr/src/app/src/user/login.html`
                    }, 5000)
                };
            };
        });
    });
};

document.addEventListener("DOMContentLoaded", () => {
    logout();
})
