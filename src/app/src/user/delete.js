'use strict';

import { fetchDelete } from "./actions.js";

function deleteUser() {
    const form = document.querySelector('form');

    form.addEventListener('submit', function(e){
        e.preventDefault();

        if (e.submitter.value ===  'delete'){
            if (confirm('Voulez-vous vraiment vous supprimer votre compte ?') === true) {
                fetchDelete()
                .then(response => console.log(response.status))
                const mainSection = document.getElementById('mainSection');
                const msg = document.createElement('dialog');
                msg.open = 'open';

                    msg.innerHTML = `
                <p>Votre compte a bien été supprimé.</p>
                <p>Vous allez nous manquer et être redirigé dans quelques instants vers l'inscription pour vous réinscrire car vous nous aimez !</p>
                `
                mainSection.append(msg);

                window.setTimeout(function() {
                window.location.href = `http://localhost/listerr/src/app/src/user/registration.html`
                }, 5000)
            }
        }
    })
}

document.addEventListener("DOMContentLoaded", () => {
    deleteUser();
})