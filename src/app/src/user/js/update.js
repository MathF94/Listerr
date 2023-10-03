'use strict';

import { fetchRead, fetchUpdate } from "./actions.js";
import { redirect, dialog } from "../../services/utils.js";

function updateUser() {
    const form = document.querySelector('form');

    fetchRead()
    .then(response => {const dataUser = response;
        for (const index in dataUser) {
            const column = dataUser[index];
            const input = document.querySelector(`input#${index}`)
            if (input){
                input.value = column.value;
            };
        };
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        fetchUpdate(form)
        .then(response => {
            if (response.status === 'success') {
                dialog({content: 'Votre profil a bien été mis à jour.'});
                redirect('http://localhost/listerr/src/app/src/user/pages/profil.html', 3000);
            };

            if (response.status === 'fail') {
                dialog({title: "Erreurs", content: response.errors, hasTimeOut: true});
                redirect('http://localhost/listerr/src/app/src/user/pages/login.html', 3000);
            };
        });
    });
};

document.addEventListener("DOMContentLoaded", () => {
    updateUser();
})
