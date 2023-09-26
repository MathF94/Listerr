'use strict';

import { fetchRead, fetchUpdate} from "./actions";

function updateUser() {
    const form = document.querySelector('form');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        window.location.href = `http://localhost/listerr/src/app/src/user/update.html`
        fetchUpdate()
        .then(response => {const updateUser = JSON.parse(response)})
        .then(response => {console.log(updateUser)})
            console.log('dans le if', e.submitter);
            console.log('ok');
            console.log(res);
        // const form = document.createElement('form');
        //     const input = document.createElement('input');
        //     input.setAttribute('name', 'name');
        //     input.setAttribute('value', res.nom);
        //     form.append(input);
        //     document.body.appendChild(form);

        // const token = localStorage.getItem('token');
        // // console.log(token);
        // let myToken = new Request("?route=user_update", { // entre guillemets, route php pour récupérer les données du token
        //     method: 'POST',
        //     body: JSON.stringify({
        //         theToken: token
        //     })
        // })

        // fetch(myToken)
        // .then(res => res.json())
        // .then(res => {
        //     console.log(JSON.parse(res));
        //     const form = document.createElement('form');
        //     const input = document.createElement('input');
        //     input.setAttribute('name', 'name');
        //     input.setAttribute('value', res.nom);
        //     form.append(input);
        //     document.body.appendChild(form);

        // })







    }) // form.addEventListener()
} // function updateUser()

function returnDisplay() {
    const anchorCancelBtn = document.getElementById('cancelBtn')
    anchorCancelBtn.addEventListener('click', function(e) {
        window.location.href = 'http://localhost/listerr/src/app/src/user/profil.html';
    })
}


document.addEventListener("DOMContentLoaded", () => {
    updateUser();
    returnDisplay();
    logout();
})
