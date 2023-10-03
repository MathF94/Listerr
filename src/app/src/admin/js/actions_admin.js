'use strict';

async function fetchReadAll() {
    try {
        const url = "http://localhost/listerr/src/api/?route=admin_read_user";
        return await fetch(url, {
            method: 'GET',
            }).then(response => response.json());
            
    } catch (error) {
        console.error('Erreur lors de la requête fetch :', error);
        return null;
    }
};

export {fetchReadAll};