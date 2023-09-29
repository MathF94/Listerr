'use strict';

import { fetchRead, fetchUpdate } from "./actions.js";
import { redirect, dialog } from "../services/utils.js";

function updateUser() {
    const form = document.querySelector('form');

    fetchRead()
    .then(response => {const dataUser = response;
        for (const index in dataUser) {
            const column = dataUser[index];
            const input = document.querySelector(`input#${index}`)
            if (input){
                input.value = column.value;
            }
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        fetchUpdate(form)
        .then(response => {
            dialog('Votre profil a bien été mis à jour.')
            redirect('http://localhost/listerr/src/app/src/user/profil.html', 3000)
        })
    }) // form.addEventListener()
} // function updateUser()

document.addEventListener("DOMContentLoaded", () => {
    updateUser();
})
