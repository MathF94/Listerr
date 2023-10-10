'use strict';

import { fetchDelete } from "./actions.js";
import { redirect, dialog, waitForElm } from "../../services/utils.js";

function deleteUser(form) {
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

waitForElm('#form').then((elm) => {
    deleteUser(elm);
});

export default deleteUser;