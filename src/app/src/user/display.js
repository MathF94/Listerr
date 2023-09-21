'use strict';

async function fetchDisplay() {
    try {
        const url = "http://localhost/listerr/src/api/?route=user_display";
        const token = localStorage.getItem('token');

        return await fetch(url, {
            method: 'post',
            headers: {'Authorization': token},
            }).then(response => response.text());

    } catch (error) {
        console.error('Erreur lors de la requête fetch :', error);
        return null;
    }
};

function display() {
    fetchDisplay()
    .then(response => {
        console.log(response);
        // faire l'html pour afficher
    });

}

document.addEventListener("DOMContentLoaded", () => {
    display();
    console.log('vous êtes sur la page du profil d\'utilsateur');

});