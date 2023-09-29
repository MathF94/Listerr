'use strict';

import { fetchLogout } from "./actions.js";

function logout() {
    const anchorLogout = document.querySelector('#logout');
    localStorage.getItem('token');

    fetchLogout()
    .then(response => {
        if (response.status === 'disconnect') {
            const mainSection = document.createElement('section');
            mainSection.id = "mainSection";
            mainSection.className = "mainSection";
            document.body.appendChild(mainSection);
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
                    localStorage.removeItem('token');
                    const mainSection = document.createElement('section');
                    mainSection.id = "mainSection";
                    mainSection.className = "mainSection";
                    document.body.appendChild(mainSection);
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

export default logout;
