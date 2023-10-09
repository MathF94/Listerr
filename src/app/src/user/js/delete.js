'use strict';

import { fetchDelete } from "./actions.js";
import { redirect, dialog } from "../../services/utils.js";

function deleteUser() {
    const form = document.querySelector('form');

    form.addEventListener('submit', function(e){
        e.preventDefault();

        if (e.submitter.value ===  'delete'){
            if (confirm('Voulez-vous vraiment vous supprimer votre compte ?') === true) {
                fetchDelete()
                .then(response => {
                    dialog({title: "Suppresion de compte",
                            content: `<p>Votre compte a bien été supprimé.</p>
                                    <p>Vous allez nous manquer et être redirigé(e) dans quelques instants vers l'inscription pour vous réinscrire car vous nous aimez !</p>`});
                    redirect('http://localhost/#/registration.html', 5000);
                });
            };
        };
    });
};

document.addEventListener("DOMContentLoaded", () => {
    deleteUser();
});

export default deleteUser;