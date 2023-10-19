'use strict';

import { fetchDelete } from "./actions.js";
import { redirect, dialog } from "../../services/utils.js";

function deleteUser() {
    const form = document.querySelector('form');

    form.addEventListener('submit', function(e){
        e.preventDefault();

        if (e.submitter.value === 'delete'){
            if (confirm('Voulez-vous vraiment vous supprimer votre compte ?') === true) {
                fetchDelete()
                .then(response => {
                    dialog({title: "Suppression de compte",
                            content: `<p>Votre compte a bien été supprimé.</p>
                                    <p>Vous allez nous manquer et être redirigé(e) dans quelques instants vers l'inscription pour vous réinscrire car vous nous aimez !</p>`});
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    redirect('http://localhost/listerr/src/app/src/user/pages/registration.html', 5000);
                });
            };
        };
    });
};

document.addEventListener("DOMContentLoaded", () => {
    deleteUser();
});