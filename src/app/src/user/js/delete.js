'use strict';

import { fetchDelete } from "../../actions/actions_user.js";
import { configPath, redirect, dialog } from "../../services/utils.js";

/**
 * Supprime le compte de l'utilisateur.
 */
function deleteUser() {
    const deleteBtn = document.querySelector('#delete');
    deleteBtn.addEventListener('click', function(e){
        e.preventDefault();

        if (e.target.value === 'delete'){
            if (confirm('Voulez-vous vraiment vous supprimer votre compte ?') === true) {
                fetchDelete()
                .then(() => {
                    dialog({title: "Suppression de compte",
                            content: `<p>Votre compte a bien été supprimé.</p>
                                    <p>Vous allez nous manquer et être redirigé(e) dans quelques instants vers la page d'inscription.</p>`});
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    redirect(`${configPath.basePath}/user/pages/registration.html`);
                });
            };
        };
    });
};

document.addEventListener("DOMContentLoaded", () => {
    deleteUser();
});